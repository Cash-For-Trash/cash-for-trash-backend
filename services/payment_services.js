import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import {
  createPaymentIntention,
  verifyPaymobHmac,
} from "../utils/paymob.js";
export const paymentService = async (
  userId,
  collectionRequestId
) => {
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
    throw new AppError(
      "Payment not found.",
      404
    );
  }

  if (payment.payment_status === "PAID") {
    throw new AppError(
      "Payment already completed.",
      400
    );
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

    case "CARD": {
      const user =
        await prisma.user.findUnique({
          where: {
            user_id: userId,
          },
        });

      if (!user) {
        throw new AppError(
          "User not found.",
          404
        );
      }

      const amountCents = Math.round(
        Number(payment.payment_amount) * 100
      );

      if (!Number.isFinite(amountCents) || amountCents < 1) {
        throw new AppError(
          "Invalid payment amount. Amount must be at least 0.01.",
          400
        );
      }

      const billingData = {
        apartment: "NA",

        email:
          user.email || "NA",

        floor: "NA",

        first_name:
          user.first_name || "Customer",

        last_name:
          user.last_name || "User",

        street: "NA",

        building: "NA",

        phone_number:
          user.mobile || "+201000000000",

        shipping_method: "NA",

        postal_code: "NA",

        city: "Cairo",

        country: "EG",

        state: "Cairo",
      };

      const intention =
        await createPaymentIntention(
          amountCents,
          payment.payment_id,
          billingData
        );

return {
  payment_id: payment.payment_id,
  payment_method: payment.payment_method,
  payment_status: payment.payment_status,
  payment_amount: payment.payment_amount,

  paymob_intention_id: intention.id,

  client_secret: intention.client_secret,

  checkout_url:
    `https://accept.paymob.com/unifiedcheckout/` +
    `?publicKey=${process.env.PAYMOB_PUBLIC_KEY}` +
    `&clientSecret=${intention.client_secret}`,
};
    }

    default:
      throw new AppError(
        "Invalid payment method.",
        400
      );
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


// webhook 
export const handlePaymobWebhook = async (req) => {
  const hmacSecret =
    process.env.PAYMOB_HMAC_SECRET;
  
  const { obj } = req.body;

  if (!obj) {
    throw new AppError(
      "Invalid webhook payload: obj is missing",
      400
    );
  }

  const isValid =
    verifyPaymobHmac(
      req.query,
      obj,
      hmacSecret
    );

  if (!isValid) {
    throw new AppError(
      "HMAC verification failed.",
      401
    );
  }

 const paymentId =
  obj.payment_key_claims?.extra?.payment_id ||
  obj.order?.merchant_order_id ||
  obj.merchant_order_id ||
  obj.extras?.payment_id;

  if (!paymentId) {
    console.error(
      "Payment ID not found in Paymob webhook"
    );

    return {
      received: true,
    };
  }

  const payment =
    await prisma.payment.findUnique({
      where: {
        payment_id: String(paymentId),
      },
    });

  if (!payment) {
    throw new AppError(
      `Payment ${paymentId} not found.`,
      404
    );
  }

  if (obj.success === true) {
    await prisma.payment.update({
      where: {
        payment_id:
          payment.payment_id,
      },

      data: {
        payment_status: "PAID",
        payment_date: new Date(),
      },
    });

  return {
    received: true,
  };
};
}