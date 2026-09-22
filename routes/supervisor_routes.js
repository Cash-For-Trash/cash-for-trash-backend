import { Router } from "express";
import {
  createWorker,
  getWorkers,
  getWorkerDetails,
  updateWorker,
  deleteWorker,
} from "../controllers/supervisor_controller.js";
import {
  createWorkerValidation,
  updateWorkerValidation,
  workerIdParamValidation,
  getWorkersQueryValidation,
} from "../validations/supervisor_validation.js";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

/**
 * @openapi
 * /api/supervisor/workers:
 *   post:
 *     tags:
 *       - Supervisor
 *     summary: Create worker
 *     description: Creates a new worker user account. Accessible by Supervisors and Admins.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: worker@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               mobile:
 *                 type: string
 *                 example: "+201012345678"
 *               national_id:
 *                 type: string
 *                 example: "29901011234567"
 *     responses:
 *       201:
 *         description: Worker created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Email or National ID already exists.
 */
router.post(
  "/workers",
  authenticate,
  authorize(ROLES.SUPERVISOR, ROLES.ADMIN),
  createWorkerValidation,
  validate,
  createWorker
);

/**
 * @openapi
 * /api/supervisor/workers:
 *   get:
 *     tags:
 *       - Supervisor
 *     summary: Get all workers (paginated)
 *     description: Returns a paginated list of workers. Accessible by Supervisors and Admins.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *     responses:
 *       200:
 *         description: Workers retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/workers",
  authenticate,
  authorize(ROLES.SUPERVISOR, ROLES.ADMIN),
  getWorkersQueryValidation,
  validate,
  getWorkers
);

/**
 * @openapi
 * /api/supervisor/workers/{id}:
 *   get:
 *     tags:
 *       - Supervisor
 *     summary: Get worker details
 *     description: Returns worker details by ID. Accessible by Supervisors and Admins.
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
 *         description: Worker details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Worker not found.
 */
router.get(
  "/workers/:id",
  authenticate,
  authorize(ROLES.SUPERVISOR, ROLES.ADMIN),
  workerIdParamValidation,
  validate,
  getWorkerDetails
);

/**
 * @openapi
 * /api/supervisor/workers/{id}:
 *   patch:
 *     tags:
 *       - Supervisor
 *     summary: Update worker details
 *     description: Updates worker profile details. Accessible by Supervisors and Admins.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Jane
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: updatedworker@example.com
 *               mobile:
 *                 type: string
 *                 example: "+201098765432"
 *               national_id:
 *                 type: string
 *                 example: "29901011234568"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *               is_approved:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Worker updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Worker not found.
 *       409:
 *         description: Email or National ID conflict.
 */
router.patch(
  "/workers/:id",
  authenticate,
  authorize(ROLES.SUPERVISOR, ROLES.ADMIN),
  updateWorkerValidation,
  validate,
  updateWorker
);

/**
 * @openapi
 * /api/supervisor/workers/{id}:
 *   delete:
 *     tags:
 *       - Supervisor
 *     summary: Remove/Deactivate worker
 *     description: Deactivates a worker account. Accessible by Supervisors and Admins.
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
 *         description: Worker deactivated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Worker not found.
 */
router.delete(
  "/workers/:id",
  authenticate,
  authorize(ROLES.SUPERVISOR, ROLES.ADMIN),
  workerIdParamValidation,
  validate,
  deleteWorker
);

export default router;
