import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { calculateWorkerShare } from "../utils/pricing.js";
import { assignWorkerForAvailability } from "../utils/worker_assignment.js";
import { formatTime, getNext7DaysRange,getNextCollectionDate,formatDate } from "../utils/time.js";
import { paginate } from "../utils/pagination.js";
export const createCollectionRequest = async (userId, data) => {
  const {
    request_type,
    address_id,
    availability_id,
    payment_method,
    quantity,
    collection_img,
    garbage_types = [],
  } = data;

  const isMixed = request_type === "MIXED";
  const isRecyclable = request_type === "RECYCLABLE";

  // Validate request type

  if (!isMixed && !isRecyclable) {
    throw new AppError("Invalid request type.", 400);
  }

  // Mixed = payment required
  if (isMixed && !payment_method) {
    throw new AppError("Payment method is required.", 400);
  }

  // Recyclable = no payment
  // if (isRecyclable && payment_method) {
  //   throw new AppError("Payment is not required.", 400);
  // }

  // Recyclable = garbage types required
  if (isRecyclable && !garbage_types.length) {
    throw new AppError(
      "Garbage types are required.",
      400
    );
  }
  if(isMixed && garbage_types.length){
    throw new AppError(
      "Garbage types are not required.",
      400
    );
  }

  // Mixed =no garbage types
  if (isMixed && garbage_types.length) {
    throw new AppError(
      "Garbage types are not required for mixed waste.",
      400
    );
  }

  // =========================
  // Check weekly request
  // =========================

  const { startDate, endDate } = getNext7DaysRange();

  const existingRequest =
    await prisma.collectionRequest.findFirst({
      where: {
        user_id: userId,
        request_date: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: "CANCELLED",
        },
      },
    });

  if (existingRequest) {
    throw new AppError(
      "You have already booked a collection this week.",
      400
    );
  }

  // Check address

  const address = await prisma.address.findFirst({
    where: {
      address_id,
      user_id: userId,
    },
  });

  if (!address) {
    throw new AppError("Address not found.", 404);
  }

 
  // Check availability


  const availability = await prisma.availability.findFirst({
    where: {
      availability_id,
    },
    include: {
      area: true,
    },
  });

  if (!availability?.area?.is_active) {
    throw new AppError(
      "Availability slot not found.",
      404
    );
  }

  const area = availability.area;

// check Area

  const addressLat = Number(address.latitude);
  const addressLng = Number(address.longitude);

  const isCovered =
    addressLat <= Number(area.north_lat) &&
    addressLat >= Number(area.south_lat) &&
    addressLng <= Number(area.east_lng) &&
    addressLng >= Number(area.west_lng);

  if (!isCovered) {
    throw new AppError(
      "Service is unavailable in your area.",
      400
    );
  }


// Check Garbage in recycling only
  if (isRecyclable) {
    const garbageTypeIds = garbage_types.map(
      (item) => item.garbage_type_id
    );

    const types = await prisma.garbageType.findMany({
      where: {
        garbage_type_id: {
          in: garbageTypeIds,
        },
      },
    });

    if (types.length !== garbageTypeIds.length) {
      throw new AppError(
        "One or more garbage types are invalid.",
        404
      );
    }
  }


  // Check subscription

  if (payment_method === "MONTHLY") {
    const subscription =
      await prisma.subscription.findFirst({
        where: {
          user_id: userId,
          is_active: true,
          end_date: {
            gte: new Date(),
          },
        },
      });

    if (!subscription) {
      throw new AppError(
        "Monthly subscription is inactive.",
        400
      );
    }
  }

  const servicePrice = isMixed
    ? Number(area.service_price || 0)
    : 0;

  const workerShare = isMixed
    ? await calculateWorkerShare(servicePrice)
    : 0;

  const result = await prisma.$transaction(async (tx) => {
    const request =
      await tx.collectionRequest.create({
        data: {
          user: {
            connect: {
              user_id: userId,
            },
          },
          address: {
            connect: {
              address_id,
            },
          },
          availability: {
            connect: {
              availability_id,
            },
          },

          request_type,

          quantity: quantity || 0,
          collection_img,

          status: "PENDING",

          payment_method: isMixed
            ? payment_method
            : null,

          scheduled_day:
            availability.day_of_week,

          scheduled_date:
            getNextCollectionDate(
              availability.day_of_week
            ),

          scheduled_from_time:
            availability.from_time,

          scheduled_to_time:
            availability.to_time,

          service_price: servicePrice,
          worker_share: workerShare,
        },
      });

    await assignWorkerForAvailability(
      availability_id,
      request.collection_request_id,
      tx
    );

    if (isRecyclable) {
      await tx.requestGarbage.createMany({
        data: garbage_types.map((item) => ({
          collection_request_id:
            request.collection_request_id,

          garbage_type_id:
            item.garbage_type_id,

          expected_weight:
            item.estimated_weight ||
            item.expected_weight ||
            0,
        })),
      });
    }


    if (isMixed) {
      await tx.payment.create({
        data: {
          collection_request_id:
            request.collection_request_id,

          payment_method,

          payment_status:
            payment_method === "MONTHLY"
              ? "PAID"
              : "PENDING",

          payment_amount: servicePrice,
        },
      });
    }

    return request;
  }, {
    maxWait: 10000,
    timeout: 15000,
  });

  return result;
};

// get customer collection request

const VALID_COLLECTION_STATUSES = [
  "PENDING",
  "NEEDS_RESCHEDULE",
  "ACCEPTED",
  "ON_THE_WAY",
  "COLLECTED",
  "CANCELLED",
];

export const getCustomerCollectionRequestService = async (userId, queryParams) => {
  const normalizedStatus = queryParams?.status
    ? queryParams.status.toString().toUpperCase()
    : undefined;

  const filterStatus = VALID_COLLECTION_STATUSES.includes(normalizedStatus)
    ? normalizedStatus
    : undefined;

  const result = await paginate(prisma.collectionRequest, queryParams, {
    where: {
      user_id: userId,
      status: filterStatus,
    },
    orderBy: {
      request_date: "desc",
    },
  });

  result.data = result.data.map((request) => ({
    request_type:request.request_type,
    collection_request_id: request.collection_request_id,
    request_date: formatDate(request.request_date),
    scheduled_day: request.scheduled_day,
    scheduled_date:
      request.scheduled_date || formatDate(getNextCollectionDate(request.scheduled_day)),
    scheduled_from_time: formatTime(request.scheduled_from_time),
    scheduled_to_time: formatTime(request.scheduled_to_time),
    status: request.status,
  }));

  return result;
};


export const getCustomerCollectionRequestDetailsService = async (
  userId,
  requestId
) => {
  const request = await prisma.collectionRequest.findFirst({
    where: {
      collection_request_id: requestId,
      user_id: userId,
    },
    include: {
      address: true,

      requestGarbages: {
        include: {
          garbageType: {
            select: {
              garbage_type_id: true,
              garbage_type_name: true,
            },
          },
        },
      },

      payments: true,
    },
  });

  if (!request) {
    throw new AppError("Collection request not found.", 404);
  }

  return {
    request_type:request.request_type,
    collection_request_id: request.collection_request_id,

    request_date: formatDate(request.request_date),

    scheduled_day: request.scheduled_day,

    scheduled_date: request.scheduled_date||formatDate(getNextCollectionDate(request.scheduled_day)),

    scheduled_from_time: formatTime(request.scheduled_from_time),

    scheduled_to_time: formatTime(request.scheduled_to_time),

    status: request.status,

    payment_method: request.payment_method||null,

    service_price: Number(request.service_price)||0,

    worker_share: Number(request.worker_share),

    address: {
      address_id: request.address.address_id,
      city: request.address.city,
    },

    garbages: request.requestGarbages.map((rg) => ({
      garbage_type_id: rg.garbageType.garbage_type_id,
      garbage_type_name: rg.garbageType.garbage_type_name,
      expected_weight: Number(rg.expected_weight),
    })),

    payment: request.payments
      ? {
          payment_id: request.payments.payment_id,
          payment_method: request.payments.payment_method,
          payment_status: request.payments.payment_status,
          payment_amount: Number(request.payments.payment_amount),
          payment_date: request.payments.payment_date,
        }
      : null,
  };
};
