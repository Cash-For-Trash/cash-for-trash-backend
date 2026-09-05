import { param,body } from "express-validator";

export const approveWorkerValidation = [
  param("id")
    .notEmpty()
    .withMessage("Worker id is required.")
    .isString()
    .withMessage("Invalid worker id."),
];


export const addActualWeightValidation = [
  param("requestId")
    .notEmpty()
    .withMessage("Request id is required.")
    .isString()
    .withMessage("Invalid request id."),

  body("requestGarbages")
    .isArray({ min: 1 })
    .withMessage("At least one garbage is required."),

  body("requestGarbages.*.request_garbage_id")
    .notEmpty()
    .withMessage("Request garbage id is required.")
    .isString()
    .withMessage("Invalid request garbage id."),

  body("requestGarbages.*.actual_weight")
    .notEmpty()
    .withMessage("Actual weight is required.")
    .isFloat({ min: 0.1 })
    .withMessage("Actual weight must be greater than 0."),
];

export const getCollectionRequestByStatusValidation = [
    param("status")
      .notEmpty()
      .withMessage("Status is required.")
      .isString()
      .withMessage("Invalid status."),
];