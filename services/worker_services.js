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

// get collection request filter by status
export const getCollectionRequestFilterByStatusService = async (workerId, status) => {
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
      status : status,
        include: {
      user: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
    },
  });

  return collectionRequests;
};
// add actual weight for collection request

// add actual weight for collection request
export const addActualWeightService = async (
  workerId,
  requestId,
  requestGarbages
) => {


  const POINTS_PER_KG = 10;

  await prisma.customer.findFirst({
    select: {
      user_id: true,
    },
  });

  const totalActualWeight = requestGarbages.reduce(
    (total, garbage) => {
      const actualWeight = Number(garbage.actual_weight) || 0;

      return total + actualWeight;
    },
    0
  );

  const totalPoints = totalActualWeight * POINTS_PER_KG;


  const updatedCollectionRequest = await prisma.$transaction(
    async (tx) => {

      const collectionRequest =
        await tx.collectionRequest.findFirst({
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
          select: {
            status: true,
            user_id: true,
          },
        });

      if (!collectionRequest) {
        throw new AppError(
          "Collection request not found or not assigned to this worker.",
          404
        );
      }

      if (collectionRequest.status === "COLLECTED") {
        throw new AppError(
          "Collection request already collected.",
          409
        );
      }

      for (const garbage of requestGarbages) {
        const actualWeight =
          Number(garbage.actual_weight) || 0;
        await tx.requestGarbage.update({
          where: {
            request_garbage_id:
              garbage.request_garbage_id,
          },
          data: {
            actual_weight: actualWeight,
            earned_points:
              actualWeight * POINTS_PER_KG,
          },
        });

      }


      await tx.pointsTransaction.create({
        data: {
          user_id: collectionRequest.user_id,
          points: totalPoints,
          reason: "Collection Request",
        },
      });


      await tx.customer.update({
        where: {
          user_id: collectionRequest.user_id,
        },
        data: {
          points: {
            increment: totalPoints,
          },
        },
      });

      const result =
        await tx.collectionRequest.update({
          where: {
            collection_request_id: requestId,
          },
          data: {
            quantity: totalActualWeight,
            status: "COLLECTED",
          },
        });

      return result;
    },
    {
      maxWait: 10000,
      timeout: 15000,
    }
  );

  const finalResult =
    await prisma.collectionRequest.findUnique({
      where: {
        collection_request_id:
          updatedCollectionRequest.collection_request_id,
      },
      include: {
        requestGarbages: true,
      },
    });
  return finalResult;
};




