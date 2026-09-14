
import Router from "express";
import { handlePaymobWebhookController,handlePaymobCallbackController } from "../controllers/payment_controller.js";
import express from "express";
const router = Router();

router.post("/", express.json(), handlePaymobWebhookController);
router.get("/callback", handlePaymobCallbackController);
export default router;