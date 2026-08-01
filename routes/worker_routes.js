import { Router } from "express";
import { approveWorker } from "../controllers/worker_controller.js";
import { ROLES } from "../utils/constants.js";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { approveWorkerValidation } from "../validations/worker_validation.js";

const router = Router();

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
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     responses:
 *       200:
 *         description: Worker approved successfully.
 *       404:
 *         description: Worker not found.
 *       409:
 *         description: Worker already approved.
 */
router.patch("/:id/approve", authenticate, authorize(ROLES.ADMIN), approveWorkerValidation, validate, approveWorker);

export default router;