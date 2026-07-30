import { body, query, param } from "express-validator";

export const createAreaValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Area name is required."),

    body("north_lat")
        .notEmpty()
        .withMessage("North latitude is required.")
        .isFloat()
        .withMessage("North latitude must be a number.")
        .toFloat(),

    body("south_lat")
        .notEmpty()
        .withMessage("South latitude is required.")
        .isFloat()
        .withMessage("South latitude must be a number.")
        .toFloat(),

    body("east_lng")
        .notEmpty()
        .withMessage("East longitude is required.")
        .isFloat()
        .withMessage("East longitude must be a number.")
        .toFloat(),

    body("west_lng")
        .notEmpty()
        .withMessage("West longitude is required.")
        .isFloat()
        .withMessage("West longitude must be a number.")
        .toFloat(),

    body("service_price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Service price must be a non-negative number.")
        .toFloat(),
];

export const updateAreaValidation = [

    body("name")
        .optional()
        .trim(),

    body("north_lat")
        .optional()
        .isFloat()
        .withMessage("North latitude must be a number.")
        .toFloat(),

    body("south_lat")
        .optional()
        .isFloat()
        .withMessage("South latitude must be a number.")
        .toFloat(),

    body("east_lng")
        .optional()
        .isFloat()
        .withMessage("East longitude must be a number.")
        .toFloat(),

    body("west_lng")
        .optional()
        .isFloat()
        .withMessage("West longitude must be a number.")
        .toFloat(),

    body("service_price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Service price must be a non-negative number.")
        .toFloat(),
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
        .trim(),

];

export const updateAreaPriceValidation = [

    param("id")
        .notEmpty()
        .withMessage("Area id is required."),

    body("service_price")
        .notEmpty()
        .withMessage("Service price is required.")
        .isFloat({ gt: 0 })
        .withMessage("Service price must be greater than zero.")
        .toFloat(),

];