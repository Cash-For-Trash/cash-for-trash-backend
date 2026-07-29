import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";

const ACTIVE_STATUSES = [
  "PENDING",
  "NEEDS_RESCHEDULE",
  "ACCEPTED",
  "ON_THE_WAY",
];

const getAvailableWorkers = async (availabilityId) => {
  return await prisma.workerAvailability.findMany({
    where: {
      availability_id: availabilityId,
      worker: {
        is_approved: true,
      },
    },
    include: {
      worker: {
        include: {
          workerRequests: {
            where: {
              is_current: true,
              collectionRequest: {
                status: {
                  in: ACTIVE_STATUSES,
                },
              },
            },
          },
        },
      },
    },
  });
};

const calculateWorkerLoad = (workers) => {
  return workers.map((workerAvailability) => ({
    user_id: workerAvailability.user_id,
    load: workerAvailability.worker.workerRequests.length,
  }));
};

const chooseWorker = (workers) => {
  if (!workers.length) {
    throw new AppError("No approved workers available.", 400);
  }

  const workersLoad = calculateWorkerLoad(workers);

  const minimumLoad = Math.min(
    ...workersLoad.map((worker) => worker.load)
  );

  const candidates = workersLoad.filter(
    (worker) => worker.load === minimumLoad
  );

  const randomIndex = Math.floor(
    Math.random() * candidates.length
  );

  return candidates[randomIndex];
};

export const assignWorkerForAvailability = async (
  availabilityId,
  collectionRequestId
) => {
  const workers = await getAvailableWorkers(availabilityId);
  const selected = chooseWorker(workers);
  await prisma.workerCollectionRequest.create({
    data: {
      user_id: selected.user_id,
      collection_request_id: collectionRequestId,
      assigned_at: new Date(),
      is_current: true,
    },
  });
  return selected;
};

export const reassignCollectionRequest = async (
  collectionRequestId,
  oldWorkerId
) => {
  const request = await prisma.collectionRequest.findUnique({
    where: {
      collection_request_id: collectionRequestId,
    },
    include: {
      workerRequests: {
        where: {
          is_current: true,
        },
      },
    },
  });

  if (!request) {
    throw new AppError("Collection request not found.", 404);
  }

  const availability = await prisma.availability.findFirst({
    where: {
      area_id: request.area_id,
      day_of_week: request.scheduled_day,
      from_time: request.scheduled_from_time,
      to_time: request.scheduled_to_time,
    },
  });

  if (!availability) {
    throw new AppError(
      "No availability slot found for the request.",
      404
    );
  }

  const workers = await prisma.workerAvailability.findMany({
    where: {
      availability_id: availability.availability_id,
      user_id: {
        not: oldWorkerId,
      },
      worker: {
        is_approved: true,
      },
    },
    include: {
      worker: {
        include: {
          workerRequests: {
            where: {
              is_current: true,
              collectionRequest: {
                status: {
                  in: ACTIVE_STATUSES,
                },
              },
            },
          },
        },
      },
    },
  });

  if (workers.length === 0) {
    await prisma.collectionRequest.update({
      where: {
        collection_request_id: collectionRequestId,
      },
      data: {
        status: "NEEDS_RESCHEDULE",
      },
    });
    return null;
  }

  const selected = chooseWorker(workers);
  await prisma.workerCollectionRequest.updateMany({
    where: {
      collection_request_id: collectionRequestId,
      is_current: true,
    },
    data: {
      is_current: false,
    },
  });
  await prisma.workerCollectionRequest.create({
    data: {
      user_id: selected.user_id,
      collection_request_id: collectionRequestId,
      assigned_at: new Date(),
      is_current: true,
    },
  });

  return selected;
};