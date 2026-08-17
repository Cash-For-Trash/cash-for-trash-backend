import {body} from "express-validator"

export const notificationValidation = [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Message is required"),
    body("type")
      .trim()
      .notEmpty()
      .withMessage("Type is required"),
    body("related_id")
      .optional()
      .trim(),
];