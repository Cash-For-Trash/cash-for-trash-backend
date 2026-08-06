
export const createPaymentController = async (req, res) => {
    try {

        const collection_request_id = req.params.id;
        const user_id = req.user.user_id;
        const payment = await createPaymentService(user_id, collection_request_id);
        return successResponse(res, 201, payment, "Payment created successfully");
    } catch (error) {
        return next(error)
    }

}

export const getPaymentHistoryController = async (req, res) => {
    try {
        const user_id = req.user.user_id
        const payments = await getPaymentHistoryService(user_id);
        return successResponse(res, 200, payments, "Payment history fetched successfully");
    } catch (error) {
        return next(error)
    }
}