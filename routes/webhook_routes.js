
import Router from "express";
import { handleStripeWebhookController } from "../controllers/payment_controller.js";
import express from "express";
const router = Router();


// webhook
/**
 * @openapi
 * /api/webhooks/stripe:
 *   post:
 *     summary: Stripe webhook
 *     tags:
 *       - Webhook
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             description: The raw JSON payload from Stripe
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Webhook handled successfully
 */
router.post("/",
      express.raw({ type: "application/json" }), handleStripeWebhookController);
export default router;