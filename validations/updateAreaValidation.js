import { body } from "express-validator";

export const updateAreaValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Area name cannot be empty.")
        .isLength({ max: 100 })
        .withMessage("Area name must not exceed 100 characters."),

    body("north_lat")
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("North latitude must be between -90 and 90."),

    body("south_lat")
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("South latitude must be between -90 and 90."),

    body("east_lng")
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("East longitude must be between -180 and 180."),

    body("west_lng")
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("West longitude must be between -180 and 180."),

    body().custom((value) => {

        if (Object.keys(value).length === 0) {
            throw new Error("Please provide at least one field to update.");
        }

        return true;

    }),

    body().custom((value) => {

        if (
            value.north_lat !== undefined &&
            value.south_lat !== undefined &&
            Number(value.north_lat) <= Number(value.south_lat)
        ) {
            throw new Error("North latitude must be greater than south latitude.");
        }

        return true;

    }),

    body().custom((value) => {

        if (
            value.east_lng !== undefined &&
            value.west_lng !== undefined &&
            Number(value.east_lng) <= Number(value.west_lng)
        ) {
            throw new Error("East longitude must be greater than west longitude.");
        }

        return true;

    })

];