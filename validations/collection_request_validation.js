import { body } from "express-validator";
import { PaymentMethod, DayOfWeek } from "@prisma/client";

export const createCollectionRequestValidation = [

    body("address_id")
        .notEmpty()
        .withMessage("Address is required."),

    body("availability_id")
        .notEmpty()
        .withMessage("Availability is required."),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required.")
        .isFloat({ min: 0.1 })
        .withMessage("Quantity must be greater than zero."),

    body("payment_method")
        .notEmpty()
        .withMessage("Payment method is required.")
        .isIn(["MONTHLY","CASH"])
        .withMessage("Invalid payment method."),

    body("collection_img")
        .optional()
        .isString(),

    body("garbage_types")
        .isArray({ min:1 })
        .withMessage("Garbage types are required."),

    body("garbage_types.*.garbage_type_id")
        .notEmpty(),

    body("garbage_types.*.estimated_weight")
        .isFloat({ min:0.1 })
];