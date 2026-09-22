import { query, param, body } from "express-validator";

export const getListValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),
  query("page_size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page size must be a positive integer."),
];
export const userIdParamValidation = [
  param("user_id")
    .notEmpty()
    .withMessage("User ID is required.")
    .isString()
    .withMessage("User ID must be a string."),
];

export const updatePointSettingsValidation = [
  body("points")
    .notEmpty()
    .withMessage("Points are required.")
    .isInt({ min: 0 })
    .withMessage("Points must be a positive integer."),
  body("cash_value")
    .notEmpty()
    .withMessage("Cash value is required.")
    .isFloat({ min: 0 })
    .withMessage("Cash value must be a positive number."),
];
