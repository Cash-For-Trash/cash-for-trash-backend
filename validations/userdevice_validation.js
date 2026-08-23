import { body } from "express-validator";

export const registerUserDeviceValidation = [
    body("fcm_token").notEmpty().withMessage("FCM token is required"),
    body("device_type").notEmpty().withMessage("Device type is required").isIn(["android","ios", "web"]).withMessage("Invalid device type"),
];