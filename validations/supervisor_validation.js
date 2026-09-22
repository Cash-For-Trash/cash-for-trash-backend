import { body, param, query } from "express-validator";

export const createWorkerValidation = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters."),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name must be between 2 and 30 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),

  body("mobile")
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone()
    .withMessage("Must be a valid mobile phone number."),

  body("national_id")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 14, max: 14 })
    .withMessage("National ID must be exactly 14 digits."),
];

export const updateWorkerValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Worker ID is required."),

  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("First name must be between 2 and 30 characters."),

  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name must be between 2 and 30 characters."),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail(),

  body("mobile")
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone()
    .withMessage("Must be a valid mobile phone number."),

  body("national_id")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 14, max: 14 })
    .withMessage("National ID must be exactly 14 digits."),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be a boolean."),

  body("is_approved")
    .optional()
    .isBoolean()
    .withMessage("is_approved must be a boolean."),
];

export const workerIdParamValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Worker ID is required."),
];

export const getWorkersQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),
  query("page_size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page size must be a positive integer."),
];
