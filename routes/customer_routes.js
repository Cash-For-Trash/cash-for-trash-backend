import { Router } from "express";
import { getCustomerPoints,getCustomerLeaderBoard } from "../controllers/customer_controller.js";
import { getCustomerPointsValidation } from "../validations/customer_validation.js";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

/**
 * @openapi
 * /api/customer/points:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get current authenticated customer points
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer points retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Customer profile not found.
 */
router.get(
  "/points",
  getCustomerPointsValidation,
  validate,
  authenticate,
  authorize(ROLES.CUSTOMER),
  getCustomerPoints
);
/**
 * @openapi
 * /api/customer/leaderboard:
 *   get:
 *     tags:
 *       - Customer
 *     summary: Get customer leaderboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customers Leaderboard retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/leaderboard",
  authenticate,
  getCustomerLeaderBoard
);



export default router;
