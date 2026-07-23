import { body } from "express-validator";
// Create Address Validation
export const createAddressValidation = [
  body("building_num")
    .notEmpty()
    .withMessage("Building number is required.")
    .isInt({ min: 1 })
    .withMessage("Building number must be a positive integer."),

  body("floor")
    .optional()
    .isString()
    .withMessage("Floor must be a string."),

  body("location")
    .notEmpty()
    .withMessage("Location is required.")
    .isString()
    .withMessage("Location must be a string."),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required.")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90."),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required.")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180."),

  body("additional_note")
    .optional()
    .isString()
    .withMessage("Additional note must be a string."),
];

// Update Address Validation
export const updateAddressValidation = [
  body("building_num")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Building number must be a positive integer."),

  body("floor")
    .optional()
    .isString()
    .withMessage("Floor must be a string."),

  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string."),

  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90."),

  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180."),

  body("additional_note")
    .optional()
    .isString()
    .withMessage("Additional note must be a string."),
];