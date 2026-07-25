import { body,query,param } from "express-validator";

export const createAreaValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Area name is required."),

    body("north_lat")
        .isFloat()
        .withMessage("North latitude must be a number."),

    body("south_lat")
        .isFloat()
        .withMessage("South latitude must be a number."),

    body("east_lng")
        .isFloat()
        .withMessage("East longitude must be a number."),

    body("west_lng")
        .isFloat()
        .withMessage("West longitude must be a number."),
];

export const updateAreaValidation = [

    body("name")
        .optional()
        .trim(),

    body("north_lat")
        .optional()
        .isFloat(),

    body("south_lat")
        .optional()
        .isFloat(),

    body("east_lng")
        .optional()
        .isFloat(),

    body("west_lng")
        .optional()
        .isFloat(),
];

export const getAreasValidation = [

    query("search")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 }),

];

export const areaIdValidation = [

    param("id")
        .notEmpty()
        .withMessage("Area ID is required.")

        .isString()
        .withMessage("Area ID must be a string.")

        .trim()

];