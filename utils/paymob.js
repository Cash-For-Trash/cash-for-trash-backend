import AppError from "../utils/app_error.js";
import crypto from "crypto";

const PAYMOB_BASE_URL =
  process.env.PAYMOB_BASE_URL || "https://accept.paymob.com";

export const createPaymentIntention = async (
  amountCents,
  merchantOrderId,
  billingData
) => {
  try {
    const response = await fetch(
      `${PAYMOB_BASE_URL}/v1/intention/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
        },

        body: JSON.stringify({
          amount: amountCents,

          currency: "EGP",

          payment_methods: [
            Number(
              process.env.PAYMOB_CARD_INTEGRATION_ID
            ),
          ],

          billing_data: billingData,

          extras: {
            merchant_order_id: String(merchantOrderId),
            payment_id: String(merchantOrderId),
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Paymob Intention Error:", data);

      throw new Error(
        data.message ||
          JSON.stringify(data) ||
          `Paymob returned ${response.status}`
      );
    }

    return data;
  } catch (error) {
    throw new AppError(
      `Paymob Intention Creation Error: ${error.message}`,
      400
    );
  }
};


export const verifyPaymobHmac = (
  query,
  obj,
  secret
) => {
  if (!query?.hmac || !secret) {
    return false;
  }

  const fields = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id,
    obj.owner,
    obj.pending,
    obj.source_data?.pan,
    obj.source_data?.sub_type,
    obj.source_data?.type,
    obj.success,
  ];

  const concatenatedString = fields
    .map((value) => {
      if (value === undefined || value === null) {
        return "";
      }

      return String(value);
    })
    .join("");

  const generatedHmac = crypto
    .createHmac("sha512", secret)
    .update(concatenatedString)
    .digest("hex");

  if (
    generatedHmac.length !==
    query.hmac.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(generatedHmac),
    Buffer.from(query.hmac)
  );
};