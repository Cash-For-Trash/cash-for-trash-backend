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

export const checkWorker= async (workerId) => {
  // Check worker
  const worker = await prisma.worker.findUnique({
    where: {
      user_id: workerId,
    },
  });

  if (!worker) {
    throw new AppError("Worker not found.", 404);
  }

  return worker;
}

const getAssignedCollectionRequest = async (workerId, requestId) => {
  const request = await prisma.collectionRequest.findFirst({
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
      collection_request_id: true,
      user_id: true,
      status: true,

      requestGarbages: {
        select: {
          request_garbage_id: true,

          garbageType: {
            select: {
              price_per_kg: true,
            },
          },
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

  if (request.status === "COLLECTED") {
    throw new AppError(
      "Collection request has already been collected.",
      400
    );
  }

  if (request.status === "CANCELLED") {
    throw new AppError(
      "Collection request has been cancelled.",
      400
    );
  }

  return request;
};


const prepareGarbageUpdates = (requestGarbages, garbages) => {
  const garbageMap = new Map(
    garbages.map((garbage) => [
      garbage.request_garbage_id,
      garbage,
    ])
  );

  let totalPoints = 0;

  const updates = requestGarbages.map((item) => {
    const garbage = garbageMap.get(item.request_garbage_id);

    if (!garbage) {
      throw new AppError(
        `Weight is missing for garbage ${item.request_garbage_id}`,
        400
      );
    }

    const weight = Number(garbage.actual_weight);

    if (!Number.isFinite(weight) || weight < 0) {
      throw new AppError(
        `Invalid weight for garbage ${item.request_garbage_id}`,
        400
      );
    }

    const pricePerKg = Number(item.garbageType.price_per_kg);

    const earnedPoints = Math.floor(pricePerKg * weight);

    totalPoints += earnedPoints;

    return {
      request_garbage_id: item.request_garbage_id,
      actual_weight: weight,
      earned_points: earnedPoints,
    };
  });

  return {
    updates,
    totalPoints,
  };
};


const completeCollectionRequest = async ({
  requestId,
  userId,
  garbageUpdates,
  totalPoints,
}) => {
  return prisma.$transaction(
    async (tx) => {
      for (const garbage of garbageUpdates) {
        await tx.requestGarbage.update({
          where: {
            request_garbage_id: garbage.request_garbage_id,
          },
          data: {
            actual_weight: garbage.actual_weight,
            earned_points: garbage.earned_points,
          },
        });
      }

      await tx.customer.update({
        where: {
          user_id: userId,
        },
        data: {
          points: {
            increment: totalPoints,
          },
        },
      });

      await tx.pointsTransaction.create({
        data: {
          user_id: userId,
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
};

export const updateCollectionRequestService = async (
  workerId,
  requestId,
  garbages
) => {
  await checkWorker(workerId);

  const request = await getAssignedCollectionRequest(
    workerId,
    requestId
  );

  const { updates, totalPoints } = prepareGarbageUpdates(
    request.requestGarbages,
    garbages
  );

  const result = await completeCollectionRequest({
    requestId,
    userId: request.user_id,
    garbageUpdates: updates,
    totalPoints,
  });

  return {
    message: "Collection request updated successfully.",
    data: result,
  };
};




