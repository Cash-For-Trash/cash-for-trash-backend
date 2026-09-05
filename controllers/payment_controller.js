import * as PaymentServices from "../services/payment_services.js";
import { successResponse } from "../utils/response.js";
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