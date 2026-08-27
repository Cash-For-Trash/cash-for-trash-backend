import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { createPaymentIntention } from "../utils/paymob.js";

export const cardPaymentService = async (
    userId,
    payment
) => {

    const user = await prisma.user.findUnique({
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
        email: user.email || "NA",
        floor: "NA",
        first_name: user.first_name || "Customer",
        last_name: user.last_name || "User",
        street: "NA",
        building: "NA",
        phone_number: user.mobile || "+201000000000",
        shipping_method: "NA",
        postal_code: "NA",
        city: "Cairo",
        country: "EG",
        state: "Cairo",
    };

    const intention = await createPaymentIntention(
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
};