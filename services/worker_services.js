import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { ROLES } from "../utils/constants.js";

export const approveWorker = async (workerId) => {
  const worker = await prisma.worker.findUnique({
    where: {
      user_id: workerId,
    },
    include: {
      user: true,
    },
  });

  if (!worker) {
    throw new AppError("Worker not found.", 404);
  }

  if (worker.user.role !== ROLES.WORKER) {
    throw new AppError("This user is not a worker.", 400);
  }

  if (worker.is_approved) {
    throw new AppError("Worker already approved.", 409);
  }

  const updatedWorker = await prisma.worker.update({
    where: {
      user_id: workerId,
    },
    data: {
      is_approved: true,
      approved_at: new Date(),
    },
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
          mobile: true,
        },
      },
    },
  });

  return updatedWorker;
};

// Get collection requests for a specific worker
export const getWorkerCollectionRequestService = async (workerId) => {
  const worker = await prisma.worker.findUnique({
    where: {
      user_id: workerId,
    },
  });

  if (!worker) {
    throw new AppError("Worker not found.", 404);
  }

  const collectionRequests = await prisma.collectionRequest.findMany({
    where: {
      availability: {
        workerAvailabilities: {
          some: {
            user_id: workerId,
          },
        },
      },
    },
  });

  return collectionRequests;
};



// get worker collection requets details
export const getWorkerCollectionRequestDetailsService = async (
  workerId,
  requestId
) => {
  const worker = await prisma.worker.findFirst({
    where: {
      user_id: workerId,
    },
  });

  if (!worker) {
    throw new AppError("Worker not found.", 404);
  }

  const collectionRequest = await prisma.collectionRequest.findFirst({
    where: {
      collection_request_id: requestId,
      availability: {
        workerAvailabilities: {
          some: {
            user_id: workerId,
          },
        },
      },
    },
    include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
          mobile: true,
        },
      },
      address: true,
      requestGarbages: {
        include: {
          garbageType: true,
        },
      },
    },
  });

  if (!collectionRequest) {
    throw new AppError(
      "Collection request not found or not assigned to this worker.",
      404
    );
  }

  return collectionRequest;
};

// update collection request
export const updateCollectionRequestService = async (
  workerId,
  requestId,
  garbages
) => {
  // Check worker
  const worker = await prisma.worker.findUnique({
    where: {
      user_id: workerId,
    },
  });

  if (!worker) {
    throw new AppError("Worker not found.", 404);
  }

  // Check collection request
  const collectionRequest = await prisma.collectionRequest.findUnique({
    where: {
      collection_request_id: requestId,
    },
  });

  if (!collectionRequest) {
    throw new AppError("Collection request not found.", 404);
  }

  if (collectionRequest.status === "COLLECTED") {
    throw new AppError(
      "Collection request has already been collected.",
      400
    );
  }

  if (collectionRequest.status === "CANCELLED") {
    throw new AppError(
      "Collection request has been cancelled.",
      400
    );
  }

  const garbageMap = new Map(
    garbages.map((g) => [g.request_garbage_id, g])
  );

  const result = await prisma.$transaction(
    async (tx) => {
      const request = await tx.collectionRequest.findFirst({
        where: {
          collection_request_id: requestId,
          availability: {
            workerAvailabilities: {
              some: {
                user_id: workerId,
              },
            },
          },
        },
        include: {
          requestGarbages: {
            include: {
              garbageType: true,
            },
          },
        },
      });

      if (!request) {
        throw new AppError(
          "Collection request not found or not assigned to this worker.",
          404
        );
      }

      let totalPoints = 0;

      await Promise.all(
        request.requestGarbages.map(async (item) => {
          const garbage = garbageMap.get(item.request_garbage_id);

          if (!garbage) {
            throw new AppError(
              `Weight is missing for garbage ${item.request_garbage_id}`,
              400
            );
          }

          const weight = Number(garbage.actual_weight);

          const earnedPoints = Math.floor(
            Number(item.garbageType.price_per_kg) * weight
          );

          totalPoints += earnedPoints;

          await tx.requestGarbage.update({
            where: {
              request_garbage_id: item.request_garbage_id,
            },
            data: {
              actual_weight: weight,
              earned_points: earnedPoints,
            },
          });
        })
      );

      await tx.customer.update({
        where: {
          user_id: request.user_id,
        },
        data: {
          points: {
            increment: totalPoints,
          },
        },
      });

      await tx.pointsTransaction.create({
        data: {
          user_id: request.user_id,
          points: totalPoints,
          reason: "Collection request completed",
        },
      });

      await tx.collectionRequest.update({
        where: {
          collection_request_id: requestId,
        },
        data: {
          status: "COLLECTED",
        },
      });

      return {
        totalPoints,
      };
    },
    {
      timeout: 10000,
    }
  );

  return {
    message: "Collection request updated successfully.",
    data: result,
  };
};




