
    import { body } from "express-validator";
export const createGarbageTypeValidation = [
 body("garbage_type_name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string."),
 body("garbage_type_image")
    .optional()
    .isString()
    .withMessage("Image must be a string."),
body("price_per_kg")
    .notEmpty()
    .withMessage("Price per kg is required.")
    .isFloat({ gt: 0 })
    .withMessage("Price per kg must be a positive number.")
]

export const updateGarbageTypeValidation = [
 body("garbage_type_name")
    .optional()
    .isString()
    .withMessage("Name must be a string."),
 body("garbage_type_image")
    .optional()
    .isString()
    .withMessage("Image must be a string."),
body("price_per_kg")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price per kg must be a positive number.")
]
