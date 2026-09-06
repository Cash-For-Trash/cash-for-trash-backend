import * as PaymentServices from "../services/payment_services.js";
import { successResponse } from "../utils/response.js";
import { paymentTemplate } from "../view/paymentTemplate.js";
export const createPaymentController = async (req, res, next) => {
    try {

        const collection_request_id = req.params.collection_request_id;
        const user_id = req.user.user_id;
        const payment = await PaymentServices.paymentService(user_id, collection_request_id);
        return successResponse(res, "Payment created successfully", payment, 201);
    } catch (error) {
        return next(error)
    }

}

export const getPaymentHistoryController = async (req, res, next) => {
    try {
        const user_id = req.user.user_id
        const payments = await PaymentServices.getPaymentHistoryService(user_id);
        return successResponse(res, "Payment history fetched successfully", payments, 200);
    } catch (error) {
        return next(error)
    }
}

export const handlePaymobWebhookController = async (req, res) => {
    try {
        await PaymentServices.handlePaymobWebhook(req);

        return res.status(200).json({
            received: true,
        });
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

const generatePaymentResultHtml = ({ isSuccess, paymentId, transactionId, amount, currency }) => {
  const title = isSuccess ? "Payment Successful" : "Payment Failed";
  const subtitle = isSuccess 
    ? "Thank you! Your payment has been processed successfully." 
    : "Something went wrong with your transaction. Please try again.";
  const icon = isSuccess ? "&#10003;" : "&#10005;";
  const themeColor = isSuccess ? "#2e7d32" : "#d32f2f";
  const bgLight = isSuccess ? "#e8f5e9" : "#ffebee";

  return paymentTemplate({
    title,
    subtitle,
    icon,
    themeColor,
    bgLight,
    isSuccess,
    paymentId,
    transactionId,
    amount,
    currency
  });
};

export const handlePaymobCallbackController = async (req, res) => {
    try {
        const { success, pending, id, amount_cents, currency, merchant_order_id, order } = req.query;
        const isSuccess = success === "true" || success === true;
        const paymentId = merchant_order_id || order || req.query.payment_id;
        const transactionId = id;

        if (isSuccess && paymentId) {
            try {
                await PaymentServices.handleCallbackSuccessFallback(String(paymentId));
            } catch (dbErr) {
                console.error("Callback fallback update notice:", dbErr.message);
            }
        }

        const html = generatePaymentResultHtml({
            isSuccess: isSuccess && pending !== "true",
            paymentId,
            transactionId,
            amount: amount_cents ? (Number(amount_cents) / 100).toFixed(2) : null,
            currency: currency || "EGP",
        });

        res.setHeader("Content-Type", "text/html");
        return res.status(200).send(html);
    } catch (error) {
        return res.status(400).send(`Callback Error: ${error.message}`);
    }   
};
