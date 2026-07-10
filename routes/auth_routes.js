import { Router } from "express";
import {register,verifyOTP,resendOTP,login,refreshToken,logout,forgotPassword,verifyResetPasswordOTP,resetPassword} from "../controllers/auth_controller.js";
import {register_validation,verifyOTPValidation,resendOTPValidation,login_validation,refresh_token_validation,forgotPasswordValidation,verifyResetPasswordOTPValidation,resetPasswordValidation} from "../validations/auth_validation.js";
import { validate, authenticate } from "../middlewares/auth_middleware.js";

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Register a new user
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *       409:
 *         description: Email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", register_validation , validate , register);
/**
 * @openapi
 * /api/auth/verify-otp:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Verify OTP
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *
 *       400:
 *         description: Invalid OTP or OTP expired.
 *
 *       404:
 *         description: User not found.
 */
router.post("/verify-otp",verifyOTPValidation,validate,verifyOTP);
/**
 * @openapi
 * /api/auth/resend-otp:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Resend OTP
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOTPRequest'
 *
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *
 *       400:
 *         description: Email is already verified.
 *
 *       404:
 *         description: User not found.
 */
router.post("/resend-otp",resendOTPValidation,validate,resendOTP);
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login
 *     description: Login using email and password.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *
 *     responses:
 *       200:
 *         description: Login successful.
 *
 *       401:
 *         description: Invalid email or password.
 *
 *       403:
 *         description: Email is not verified.
 */
router.post("/login",login_validation,validate,login);
/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     tags:
 *       - Authentication
 *     description: Generate a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *       401:
 *         description: Invalid refresh token.
 */
router.post("/refresh-token",refresh_token_validation,validate,refreshToken);
/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags:
 *       - Authentication
 *     description: Logout the current user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *       401:
 *         description: Unauthorized.
 */
router.post("/logout",authenticate,logout);
/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags:
 *       - Authentication
 *     description: Generate and send a password reset OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset OTP sent successfully.
 *       404:
 *         description: User not found.
 */
router.post("/forgot-password",forgotPasswordValidation,validate,forgotPassword);
/**
 * @openapi
 * /api/auth/verify-reset-password-otp:
 *   post:
 *     summary: Verify Reset Password OTP
 *     tags:
 *       - Authentication
 *     description: Verify the OTP sent to the user's email for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyResetPasswordOTPRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid OTP or OTP expired.
 *       404:
 *         description: User not found.
 */
router.post("/verify-reset-password-otp",verifyResetPasswordOTPValidation,validate,verifyResetPasswordOTP);
/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     tags:
 *       - Authentication
 *     description: Reset the user password after successful OTP verification.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid OTP or OTP expired.
 *       404:
 *         description: User not found.
 */
router.post("/reset-password",resetPasswordValidation,validate,resetPassword);

export default router;