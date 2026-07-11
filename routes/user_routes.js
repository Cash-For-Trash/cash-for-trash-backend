import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  changePassword,
} from "../controllers/user_controller.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import {
  UserUpdateValidation,
  UserChangePasswordValidation,
} from "../validations/user_validation.js";

const router = Router();

/**
 * @openapi
 * /api/user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.get("/profile", authenticate, getUserProfile);

/**
 * @openapi
 * /api/user/profile:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.put(
  "/profile",
  authenticate,
  UserUpdateValidation,
  validate,
  updateUserProfile
);

/**
 * @openapi
 * /api/user/profile:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.delete("/profile", authenticate, authorize("admin"), deleteUserProfile);

/**
 * @openapi
 * /api/user/change-password:
 *   put:
 *     tags:
 *       - User
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.put(
  "/change-password",
  authenticate,
  UserChangePasswordValidation,
  validate,
  changePassword
);

export default router;