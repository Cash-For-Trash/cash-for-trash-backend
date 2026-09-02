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
    },
  });

  return collectionRequests;
};
// add actual weight for collection request
export const addActualWeightService = async (
  workerId,
  requestId,
  requestGarbages
) => {
  return await prisma.$transaction(async (tx) => {
    //  Check worker
    const worker = await tx.worker.findUnique({
      where: {
        user_id: workerId,
      },
    });

    if (!worker) {
      throw new AppError("Worker not found.", 404);
    }

    //  Check collection request
    const collectionRequest = await tx.collectionRequest.findFirst({
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
        requestGarbages: true,
      },
    });

    if (!collectionRequest) {
      throw new AppError(
        "Collection request not found or not assigned to this worker.",
        404
      );
    }


    for (const garbage of requestGarbages) {
      const earnedPoints = garbage.actual_weight * 10;

      await tx.requestGarbage.update({
        where: {
          request_garbage_id: garbage.request_garbage_id,
        },
        data: {
          actual_weight: garbage.actual_weight,
          earned_points: earnedPoints,
        },
      });
    }

    //  Calculate total actual weight
    const totalWeight = await tx.requestGarbage.aggregate({
      where: {
        collection_request_id: requestId,
      },
      _sum: {
        actual_weight: true,
      },
    });

    const totalActualWeight = totalWeight._sum.actual_weight ?? 0;

 
    const totalPoints = totalActualWeight * 10;

    //  Create points transaction
    await tx.pointsTransaction.create({
      data: {
        user_id: collectionRequest.user_id,
        points: totalPoints,
        reason: "Collection Request",
      },
    });

    //  Add points to customer
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

    //  Update collection request
    const updatedCollectionRequest =
      await tx.collectionRequest.update({
        where: {
          collection_request_id: requestId,
        },
        data: {
          quantity: totalActualWeight,
          status: "COLLECTED",
        },
        include: {
          requestGarbages: true,
        },
      });

    return updatedCollectionRequest;
  });
};



