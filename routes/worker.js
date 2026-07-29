import { Router } from "express";
import { approveWorker } from "../controllers/worker_controller";
import { ROLES } from "../utils/constants";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { approveWorkerValidation } from "../validations/worker_validation";
/**
 * @openapi
 * /api/workers/{id}/approve:
 *   patch:
 *     summary: Approve Worker
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Worker approved successfully.
 *       404:
 *         description: Worker not found.
 *       409:
 *         description: Worker already approved.
 */
router.patch("/:id/approve",authenticate,authorize(ROLES.ADMIN),approveWorkerValidation,validate,approveWorker);