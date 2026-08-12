import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import stripe from "../utils/stripe.js"
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

case "CARD": {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd", 

          product_data: {
            name: "Collection Request Service",
          },

          unit_amount: Math.round(Number(payment.payment_amount) * 100),
        },

        quantity: 1,
      },
    ],

    mode: "payment",

    success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `http://localhost:3000/payment/cancel`,

    metadata: {
      payment_id: payment.payment_id,
      collection_request_id: collectionRequestId,
      user_id: userId,
    },
  });

  return {
    payment_id: payment.payment_id,
    payment_method: payment.payment_method,
    payment_status: payment.payment_status,
    payment_amount: payment.payment_amount,
    payment_url: session.url,
  };
}

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


// webhook form stripe 
export const handleStripeWebhook = async (req) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new AppError(`Webhook error: ${err.message}`, 400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await prisma.payment.update({
        where: { payment_id: session.metadata.payment_id },
        data: {
          payment_status: "PAID",
           payment_date: new Date(),        
        },
      });
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { received: true };
};