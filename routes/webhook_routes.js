
import Router from "express";
import { handlePaymobWebhookController } from "../controllers/payment_controller.js";
import express from "express";
const router = Router();

router.post("/", express.json(), handlePaymobWebhookController);

export default router;