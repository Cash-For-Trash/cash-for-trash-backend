import * as authService from "../services/auth_services.js";
import { successResponse } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    return successResponse(
      res,
      "User registered successfully. Please verify your email using the OTP sent.",
      user,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const data = await authService.verifyOTP(req.body);

    return successResponse(
      res,
      "Email verified successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const data = await authService.resendOTP(req.body);

    return successResponse(
      res,
      "OTP sent successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {

    const result = await authService.login(req.body);

    return successResponse(
      res,
      "Login successful.",
      result,
      200
    );

  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req.body);

    return successResponse(
      res,
      "Token refreshed successfully.",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    return successResponse(
      res,
      "Logged out successfully."
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.forgotPassword(
                req.body
            );

        return successResponse(
            res,
            "Password reset OTP sent successfully.",
            result
        );

    } catch (error) {

        next(error);

    }

};

export const verifyResetPasswordOTP = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.verifyResetPasswordOTP(
                req.body
            );

        return successResponse(
            res,
            "OTP verified successfully.",
            result
        );

    } catch (error) {

        next(error);

    }

};

export const resetPassword = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.resetPassword(
                req.body
            );

        return successResponse(
            res,
            "Password reset successfully.",
            result
        );

    } catch (error) {

        next(error);

    }

};

export const checkToken = async (req, res, next) => {
  try {
    const result = await authService.checkToken(req.user);
    return successResponse(
      res,
      "Token is valid.",
      result
    );
  } catch (error) {
    next(error);
  }
};
