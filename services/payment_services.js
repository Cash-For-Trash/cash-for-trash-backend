import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";

export const paymentService = async (userId, collectionRequestId) => {
  const payment = await prisma.payment.findFirst({
    where: {
      collection_request_id: collectionRequestId,
      collectionRequest: {
        user_id: userId,
      },
    },
    include: {
      collectionRequest: {
        select: {
          collection_request_id: true,
          service_price: true,
          status: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError("Payment not found.", 404);
  }

  if (payment.payment_status === "PAID") {
    throw new AppError("Payment already completed.", 400);
  }

  switch (payment.payment_method) {
    case "CASH":
      throw new AppError(
        "Cash payment does not require online payment.",
        400
      );

    case "MONTHLY":
      throw new AppError(
        "Monthly subscription has already been paid.",
        400
      );

    case "CARD":
    case "WALLET":
      return {
        payment_id: payment.payment_id,
        payment_method: payment.payment_method,
        payment_amount: payment.payment_amount,
        payment_status: payment.payment_status,
        payment_url: `https://fake-payment-url.com/${payment.payment_id}`,
      };

    default:
      throw new AppError("Invalid payment method.", 400);
  }
};



export const getPaymentHistoryService = async (userId) => {
  const payments = await prisma.payment.findMany({
    where: {
      collectionRequest: {
        user_id: userId,
      },
    },
    include: {
      collectionRequest: {
        select: {
          collection_request_id: true,
          request_date: true,
          service_price: true,
          status: true,
        },
      },
    },
    orderBy: {
      payment_date: "desc",
    },
  });

  return payments;
};