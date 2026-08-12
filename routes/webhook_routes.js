
import Router from "express";
import { handleStripeWebhookController } from "../controllers/payment_controller.js";
import express from "express";
const router = Router();

router.post("/", express.raw({ type: "application/json" }), handleStripeWebhookController);

export default router;