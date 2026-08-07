
import Router from "express";
import { createPaymentController,getPaymentHistoryController } from "../controllers/payment_controller.js";
import { authenticate } from "../middlewares/auth_middleware.js"
const router = Router();


// create payment
/**
 * @openapi
 * /api/payment/{collection_request_id}:
 *   post:
 *     summary: Create a payment
 *     tags:
 *       - Payment
 *     parameters:
 *       - in: path
 *         name: collection_request_id
 *         required: true
 *         description: Collection request ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_method:
 *                 type: string
 *                 description: Payment method
 *     responses:
 *       201:
 *         description: Payment created successfully
 */
router.post("/:collection_request_id", authenticate,createPaymentController);


// get payment history
/**
 * @openapi
 * /api/payment/my-payments:
 *   get:
 *     summary: Get my payment history
 *     tags:
 *       - Payment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history fetched successfully
 */
router.get("/my-payments", authenticate, getPaymentHistoryController);

export default router;