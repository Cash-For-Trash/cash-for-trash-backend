import jwt from "jsonwebtoken";
import AppError from "./app_error.js";
import { JWT } from "./constants.js";

/**
 * Generate Access Token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: JWT.ACCESS_TOKEN_EXPIRES,
    }
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: JWT.REFRESH_TOKEN_EXPIRES,
    }
  );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    throw new AppError("Invalid or expired access token.", 401);
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError("Invalid or expired refresh token.", 401);
  }
};