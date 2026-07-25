import { body } from "express-validator";

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