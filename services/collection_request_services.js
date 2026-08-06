import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { calculateWorkerShare } from "../utils/pricing.js";
import { assignWorkerForAvailability } from "../utils/worker_assignment.js";

export const createCollectionRequest = async (userId, data) => {
  const {
    address_id,
    availability_id,
    payment_method,
    quantity,
    collection_img,
    garbage_types,
  } = data;

  const address = await prisma.address.findFirst({
    where: {
      address_id,
      user_id: userId,
    },
  });

  if (!address) {
    throw new AppError("Address not found.", 404);
  }

  const area = await prisma.area.findFirst({
    where: {
      is_active: true,
      north_lat: { gte: address.latitude },
      south_lat: { lte: address.latitude },
      east_lng: { gte: address.longitude },
      west_lng: { lte: address.longitude },
    },
  });

  if (!area) {
    throw new AppError("Service is unavailable in your area.", 400);
  }

  const availability = await prisma.availability.findFirst({
    where: {
      availability_id,
      area_id: area.area_id,
    },
  });

  if (!availability) {
    throw new AppError("Availability slot not found.", 404);
  }

  if (payment_method === "MONTHLY") {
    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: userId,
        is_active: true,
        end_date: { gte: new Date() },
      },
    });

    if (!subscription) {
      throw new AppError("Monthly subscription is inactive.", 400);
    }
  }

  const garbageTypeIds = garbage_types.map((g) => g.garbage_type_id);
  const types = await prisma.garbageType.findMany({
    where: {
      garbage_type_id: { in: garbageTypeIds },
    },
  });

  if (types.length !== garbageTypeIds.length) {
    throw new AppError("One or more garbage types are invalid.", 404);
  }

  const servicePrice = Number(area.service_price || 0);
  const workerShare = await calculateWorkerShare(servicePrice);

  const result = await prisma.$transaction(async (tx) => {
    const request = await tx.collectionRequest.create({
      data: {
        user_id: userId,
        address_id,
        availability_id,
        quantity,
        collection_img,
        status: "PENDING",
        payment_method,
        scheduled_day: availability.day_of_week,
        scheduled_from_time: availability.from_time,
        scheduled_to_time: availability.to_time,
        service_price: servicePrice,
        worker_share: workerShare,
      },
    });

    await tx.requestGarbage.createMany({
      data: garbage_types.map((item) => ({
        collection_request_id: request.collection_request_id,
        garbage_type_id: item.garbage_type_id,
        expected_weight: item.estimated_weight || item.expected_weight || 0,
      })),
    });

    await tx.payment.create({
      data: {
        collection_request_id: request.collection_request_id,
        payment_method: payment_method,
        payment_status: payment_method === "MONTHLY" ? "PAID" : "PENDING",
        payment_amount: servicePrice,
      },
    });


    return request;
  });

  await assignWorkerForAvailability(
    availability.availability_id,
    result.collection_request_id
  );

  return result;
};


// get customer collection request

export const getCustomerCollectionRequestService = async (userId) => {
  const collectionRequests = await prisma.collectionRequest.findMany({
    where: {
      user_id: userId,
    },
    include: {
      address:true,
      requestGarbages: {
        include: {
          garbageType: true
        }
      }
    }
  });
  return collectionRequests;
};

