import { body,param } from "express-validator";

export const createAvailabilityValidation = [

    body("area_id")
        .notEmpty()
        .withMessage("Area ID is required."),

    body("day_of_week")
        .notEmpty()
        .isIn([
            "SATURDAY",
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY"
        ])
        .withMessage("Invalid day of week."),

    body("from_time")
        .notEmpty()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage("Invalid from time. Format must be HH:mm:ss."),

    body("to_time")
        .notEmpty()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage("Invalid to time. Format must be HH:mm:ss.")

];

export const updateAvailabilityValidation = [

    param("availability_id")
        .notEmpty()
        .withMessage("Availability ID is required."),

    body("area_id")
        .optional()
        .isString()
        .withMessage("Area ID must be a string."),

    body("day_of_week")
        .optional()
        .isIn([
            "SATURDAY",
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY"
        ])
        .withMessage("Invalid day of week."),

    body("from_time")
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage("from_time must be HH:mm:ss"),

    body("to_time")
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .withMessage("to_time must be HH:mm:ss")

];