import { body } from "express-validator";

export const UserUpdateValidation = [
  body("first_name")
    .optional()
    .isString(),

  body("last_name")
    .optional()
    .isString(),

  body("mobile")
    .optional()
    .isString(),

  body("image")
    .optional()
    .isURL(),
];

export const UserChangePasswordValidation = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required."),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];