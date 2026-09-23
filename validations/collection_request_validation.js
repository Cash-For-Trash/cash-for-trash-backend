import { body } from "express-validator";
export const createCollectionRequestValidation = [

    body("address_id")
        .notEmpty()
        .withMessage("Address is required."),

    body("availability_id")
        .notEmpty()
        .withMessage("Availability is required."),

    body("request_type")
        .notEmpty()
        .withMessage("Request type is required.")
        .isIn(["MIXED", "RECYCLABLE"])
        .withMessage("Invalid request type."),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required.")
        .isFloat({ min: 0.1 })
        .withMessage("Quantity must be greater than zero."),

    body("payment_method")
        .if(body("request_type").equals("MIXED"))
        .notEmpty()
        .withMessage("Payment method is required.")
        .isIn(["MONTHLY", "CASH", "CARD", "WALLET"])
        .withMessage("Invalid payment method."),

    body("payment_method")
        .if(body("request_type").equals("RECYCLABLE"))
        .custom((value) => !value)
        .withMessage("Payment is not required."),

    body("collection_img")
        .optional()
        .isString(),

    body("garbage_types")
        .if(body("request_type").equals("RECYCLABLE"))
        .isArray({ min: 1 })
        .withMessage("Garbage types are required."),

    body("garbage_types.*.garbage_type_id")
        .if(body("request_type").equals("RECYCLABLE"))
        .notEmpty()
        .withMessage("Garbage type is required."),

    body("garbage_types.*.estimated_weight")
        .if(body("request_type").equals("RECYCLABLE"))
        .isFloat({ min: 0.1 })
        .withMessage("Estimated weight must be greater than zero.")
];