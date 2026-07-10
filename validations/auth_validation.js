import { body } from "express-validator";
import { ROLES } from "../utils/constants.js";

export const register_validation = [
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
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter and one number."
    ),

   body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),

  body("mobile")
    .optional()
    .matches(/^01[0125][0-9]{8}$/)
    .withMessage("Please enter a valid Egyptian mobile number."),

  body("role")
    .notEmpty()
    .withMessage("Role is required.")
    .isIn(["customer", "worker"])
    .withMessage("Role must be either customer or worker."),

    body("national_id")
    .if(body("role").equals(ROLES.WORKER))
    .notEmpty()
    .withMessage("National ID is required.")
    .isLength({ min: 14, max: 14 })
    .withMessage("National ID must be exactly 14 digits.")
    .isNumeric()
    .withMessage("National ID must contain only numbers."),
];


export const verifyOTPValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email."),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits."),
];

export const resendOTPValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email."),
];



export const login_validation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

export const refresh_token_validation = [
    body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required.")
];

export const forgotPasswordValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
];

export const verifyResetPasswordOTPValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email."),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits.")

];

export const resetPasswordValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email."),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required.")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits."),

    body("new_password")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter and one number."
        ),

    body("confirm_password")
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {

            if (value !== req.body.new_password) {
                throw new Error("Passwords do not match.");
            }

            return true;

        }),

];