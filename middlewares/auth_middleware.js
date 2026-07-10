import { validationResult } from "express-validator";
import { errorResponse } from "../utils/response.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/App_error.js";


export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new AppError("Validation failed", 400);

    error.errors = errors.array();

    return next(error);
  }

  next();
};

export const authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError("Authentication required.", 401)
    );
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    req.user = decoded;

    next();

  } catch {

    next(
      new AppError("Invalid or expired token.", 401)
    );
  }

};