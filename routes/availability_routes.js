import { Router } from "express";

import { createAvailability } from "../controllers/availability_controller.js";

import { createAvailabilityValidation } from "../validations/availability_validation.js";

import { authenticate, validate } from "../middlewares/auth_middleware.js";

import { authorize } from "../middlewares/roles_middleware.js";

const router = Router();
/**
 * @openapi
 * /api/availabilities:
 *   post:
 *     tags:
 *       - Availability
 *     summary: Create worker availability
 *     description: Creates a new availability for the authenticated worker.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAvailabilityRequest'
 *     responses:
 *       201:
 *         description: Availability created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Worker is not approved.
 *       404:
 *         description: Area not found.
 *       409:
 *         description: Availability already exists or overlaps.
 */
router.post("/",authenticate,authorize("worker"),createAvailabilityValidation,validate,createAvailability);

export default router;