import { body } from "express-validator";

export const createRewardValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Reward name is required.")
    .isLength({ max: 100 })
    .withMessage("Reward name must not exceed 100 characters."),

  body("required_points")
    .notEmpty()
    .withMessage("Required points is required.")
    .isNumeric()
    .withMessage("Required points must be a number.")
    .custom((value) => {
      if (Number(value) < 100) {
        throw new Error("Required points must be at least 100.");
      }
      return true;
    }),
];

export const updateRewardValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Reward name cannot be empty.")
    .isLength({ max: 100 })
    .withMessage("Reward name must not exceed 100 characters."),

  body("required_points")
    .optional()
    .isNumeric()
    .withMessage("Required points must be a number.")
    .custom((value) => {
      if (Number(value) < 100) {
        throw new Error("Required points must be at least 100.");
      }
      return true;
    }),
];