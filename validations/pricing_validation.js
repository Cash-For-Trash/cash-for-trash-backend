import { body } from "express-validator";

export const updatePricingValidation = [

    body("worker_percentage")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("Worker percentage must be between 0 and 100."),

    body("monthly_subscription_price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Monthly subscription price must be greater than or equal to 0.")

];