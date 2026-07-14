import { query, param } from "express-validator";

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
