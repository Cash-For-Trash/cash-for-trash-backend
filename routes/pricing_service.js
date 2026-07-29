import { Router } from "express";

import {getPricingSettings,updatePricingSettings} from "../controllers/pricing.controller.js";

import {authenticate} from "../middlewares/auth.middleware.js";

import { authorize } from "../middlewares/role.middleware.js";

import { validate } from "../middlewares/validation.middleware.js";

import { updatePricingValidation } from "../validations/pricing.validation.js";

import { ROLES } from "../utils/constants.js";

const router = Router();
/**
 * @openapi
 * /api/pricing:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get pricing settings
 *     description: Retrieve the current worker percentage and monthly subscription price.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pricing settings retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get("/",authenticate,authorize(ROLES.ADMIN),getPricingSettings);
/**
 * @openapi
 * /api/pricing:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update pricing settings
 *     description: Update worker percentage and monthly subscription price. Admin only.
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               worker_percentage:
 *                 type: number
 *                 example: 70
 *               monthly_subscription_price:
 *                 type: number
 *                 example: 120
 *
 *     responses:
 *       200:
 *         description: Pricing settings updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.patch("/",authenticate,authorize(ROLES.ADMIN),updatePricingValidation,validate,updatePricingSettings);

export default router;