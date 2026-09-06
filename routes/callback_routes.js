import { Router } from "express";
import { handlePaymobCallbackController } from "../controllers/payment_controller.js";
import express from "express";

const router = Router();

/**
 * @openapi
 * /api/callback:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Paymob transaction response callback (GET)
 *     description: Handle Paymob transaction response callback redirect via GET query parameters.
 *     parameters:
 *       - in: query
 *         name: success
 *         schema:
 *           type: string
 *         example: "true"
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         example: "123456"
 *       - in: query
 *         name: merchant_order_id
 *         schema:
 *           type: string
 *         example: "cmrabc123"
 *     responses:
 *       200:
 *         description: Callback processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid callback payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags:
 *       - Payment
 *     summary: Paymob transaction response callback (POST)
 *     description: Handle Paymob transaction response callback payload via POST request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DefaultRequest'
 *     responses:
 *       200:
 *         description: Callback processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid callback payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", handlePaymobCallbackController);
router.post("/", express.json(), handlePaymobCallbackController);

export default router;
