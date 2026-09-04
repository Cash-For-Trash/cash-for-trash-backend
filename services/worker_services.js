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

// add actual weight for collection request
export const addActualWeightService = async (
  workerId,
  requestId,
  requestGarbages
) => {
  console.time("========== TOTAL SERVICE ==========");

  const POINTS_PER_KG = 10;

  console.log("\n========== ADD ACTUAL WEIGHT START ==========");
  console.log("workerId:", workerId);
  console.log("requestId:", requestId);
  console.log("requestGarbages count:", requestGarbages.length);

  // =====================================================
  // TEST 1: Basic DB Connection
  // =====================================================

  console.time("TEST 1 - SELECT 1");

  await prisma.$queryRaw`SELECT 1`;

  console.timeEnd("TEST 1 - SELECT 1");

  // =====================================================
  // TEST 2: Simple Customer Query
  // =====================================================

  console.time("TEST 2 - Customer findFirst");

  await prisma.customer.findFirst({
    select: {
      user_id: true,
    },
  });

  console.timeEnd("TEST 2 - Customer findFirst");

  // =====================================================
  // Calculate Total Weight
  // =====================================================

  console.time("Calculate Total Weight");

  const totalActualWeight = requestGarbages.reduce(
    (total, garbage) => {
      const actualWeight = Number(garbage.actual_weight) || 0;

      console.log(
        `Garbage ${garbage.request_garbage_id}:`,
        actualWeight
      );

      return total + actualWeight;
    },
    0
  );

  const totalPoints = totalActualWeight * POINTS_PER_KG;

  console.log("Total Actual Weight:", totalActualWeight);
  console.log("Total Points:", totalPoints);

  console.timeEnd("Calculate Total Weight");

  // =====================================================
  // TRANSACTION
  // =====================================================

  console.time("========== TOTAL TRANSACTION ==========");

  const updatedCollectionRequest = await prisma.$transaction(
    async (tx) => {
      console.log("\n========== TRANSACTION START ==========");

      // =================================================
      // 1. Find Collection Request
      // =================================================

      console.time("1 - Find Collection Request");

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

      console.timeEnd("1 - Find Collection Request");

      console.log(
        "Collection Request:",
        collectionRequest
      );

      // =================================================
      // 2. Validation
      // =================================================

      console.time("2 - Validation");

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

      console.timeEnd("2 - Validation");

      // =================================================
      // 3. Update Request Garbages
      // =================================================

      console.time("3 - ALL Request Garbage Updates");

      for (const garbage of requestGarbages) {
        const actualWeight =
          Number(garbage.actual_weight) || 0;

        console.log(
          "\nUpdating Garbage:",
          garbage.request_garbage_id
        );

        console.time(
          `3 - Garbage ${garbage.request_garbage_id}`
        );

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

        console.timeEnd(
          `3 - Garbage ${garbage.request_garbage_id}`
        );
      }

      console.timeEnd("3 - ALL Request Garbage Updates");

      // =================================================
      // 4. Create Points Transaction
      // =================================================

      console.time("4 - Create Points Transaction");

      await tx.pointsTransaction.create({
        data: {
          user_id: collectionRequest.user_id,
          points: totalPoints,
          reason: "Collection Request",
        },
      });

      console.timeEnd("4 - Create Points Transaction");

      // =================================================
      // 5. Update Customer
      // =================================================

      console.time("5 - Update Customer Points");

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

      console.timeEnd("5 - Update Customer Points");

      // =================================================
      // 6. Update Collection Request
      // =================================================

      console.time("6 - Update Collection Request");

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

      console.timeEnd("6 - Update Collection Request");

      console.log(
        "Collection request updated successfully."
      );

      console.log(
        "\n========== TRANSACTION OPERATIONS DONE =========="
      );

      return result;
    },
    {
      maxWait: 10000,
      timeout: 15000,
    }
  );

  console.timeEnd("========== TOTAL TRANSACTION ==========");

  // =====================================================
  // Get Final Result
  // =====================================================

  console.time("7 - Get Full Collection Request");

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

  console.timeEnd("7 - Get Full Collection Request");

  // =====================================================
  // Final
  // =====================================================

  console.timeEnd("========== TOTAL SERVICE ==========");

  console.log("\n========== PERFORMANCE SUMMARY ==========");
  console.log("Total Weight:", totalActualWeight);
  console.log("Total Points:", totalPoints);
  console.log(
    "Garbages Count:",
    requestGarbages.length
  );
  console.log("=========================================\n");

  return finalResult;
};




