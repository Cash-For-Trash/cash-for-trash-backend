import { param } from "express-validator";

export const approveWorkerValidation = [
  param("id")
    .notEmpty()
    .withMessage("Worker id is required.")
    .isString()
    .withMessage("Invalid worker id."),
];