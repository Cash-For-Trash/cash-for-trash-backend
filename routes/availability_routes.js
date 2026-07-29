import { Router } from "express";

import { createAvailability,getMyAvailabilities,updateAvailability } from "../controllers/availability_controller.js";

import { createAvailabilityValidation,updateAvailabilityValidation } from "../validations/availability_validation.js";

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
/**
 * @openapi
 * /api/availabilities/my:
 *   get:
 *     tags:
 *       - Availability
 *     summary: Get all availabilities for the logged-in worker
 *     description: Returns all availability slots assigned to the authenticated worker.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Availabilities retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Availabilities retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Only workers can access this endpoint.
 */
router.get("/my",authenticate,authorize("worker"),getMyAvailabilities);
/**
 * @openapi
 * /api/availabilities/{availability_id}:
 *   patch:
 *     tags:
 *       - Availability
 *     summary: Update worker availability
 *     description: Update one of the authenticated worker's availability slots.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: availability_id
 *         required: true
 *         schema:
 *           type: string
 *         example: cms0xyg8b0001v1yczwf1xxgd
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               area_id:
 *                 type: string
 *                 example: cms0x7nz90001v1y85ddoefwp
 *               day_of_week:
 *                 type: string
 *                 enum:
 *                   - SATURDAY
 *                   - SUNDAY
 *                   - MONDAY
 *                   - TUESDAY
 *                   - WEDNESDAY
 *                   - THURSDAY
 *                   - FRIDAY
 *                 example: SATURDAY
 *               from_time:
 *                 type: string
 *                 example: "09:00:00"
 *               to_time:
 *                 type: string
 *                 example: "12:00:00"
 *     responses:
 *       200:
 *         description: Availability updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Availability updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Only workers can update availability.
 *       404:
 *         description: Availability not found.
 *       409:
 *         description: Availability overlaps with another availability.
 */
router.patch("/:availability_id",authenticate,authorize("worker"),updateAvailabilityValidation,validate,updateAvailability);

export default router;