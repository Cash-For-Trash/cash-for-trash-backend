import { Router } from "express";
import {
  getCustomers,
  getCustomerDetails,
  getWorkers,
  getWorkerDetails,
  createSupervisor,
  getSupervisors,
  getSupervisorDetails,
  updateSupervisor,
  deleteSupervisor,
} from "../controllers/admin_controller.js";
import {
  getListValidation,
  userIdParamValidation,
  createSupervisorValidation,
  updateSupervisorValidation,
} from "../validations/admin_validation.js";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

/**
 * @openapi
 * /api/admin/customers:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all customers (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *         description: Page number
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Customers list retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/customers",
  authenticate,
  authorize(ROLES.ADMIN),
  getListValidation,
  validate,
  getCustomers
);

/**
 * @openapi
 * /api/admin/customers/{user_id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get customer details by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *         description: Customer user ID
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Customer not found.
 */
router.get(
  "/customers/:user_id",
  authenticate,
  authorize(ROLES.ADMIN),
  userIdParamValidation,
  validate,
  getCustomerDetails
);

/**
 * @openapi
 * /api/admin/workers:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all workers (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *         description: Page number
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Workers list retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/workers",
  authenticate,
  authorize(ROLES.ADMIN),
  getListValidation,
  validate,
  getWorkers
);

/**
 * @openapi
 * /api/admin/workers/{user_id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get worker details by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *         description: Worker user ID
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
  "/workers/:user_id",
  authenticate,
  authorize(ROLES.ADMIN),
  userIdParamValidation,
  validate,
  getWorkerDetails
);

/**
 * @openapi
 * /api/admin/supervisors:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new supervisor
 *     description: Creates a supervisor user account. Admin only.
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
 *                 example: Sam
 *               last_name:
 *                 type: string
 *                 example: Supervisor
 *               email:
 *                 type: string
 *                 example: supervisor@example.com
 *               password:
 *                 type: string
 *                 example: supersecret123
 *               mobile:
 *                 type: string
 *                 example: "+201011223344"
 *     responses:
 *       201:
 *         description: Supervisor created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Email already in use.
 */
router.post(
  "/supervisors",
  authenticate,
  authorize(ROLES.ADMIN),
  createSupervisorValidation,
  validate,
  createSupervisor
);

/**
 * @openapi
 * /api/admin/supervisors:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all supervisors (paginated)
 *     description: Returns a paginated list of supervisors. Admin only.
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
 *         description: Supervisors retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
  "/supervisors",
  authenticate,
  authorize(ROLES.ADMIN),
  getListValidation,
  validate,
  getSupervisors
);

/**
 * @openapi
 * /api/admin/supervisors/{user_id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get supervisor details by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     responses:
 *       200:
 *         description: Supervisor details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Supervisor not found.
 */
router.get(
  "/supervisors/:user_id",
  authenticate,
  authorize(ROLES.ADMIN),
  userIdParamValidation,
  validate,
  getSupervisorDetails
);

/**
 * @openapi
 * /api/admin/supervisors/{user_id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update supervisor details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
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
 *                 example: Samuel
 *               last_name:
 *                 type: string
 *                 example: Supervisor
 *               email:
 *                 type: string
 *                 example: sam.supervisor@example.com
 *               mobile:
 *                 type: string
 *                 example: "+201099887766"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Supervisor updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Supervisor not found.
 *       409:
 *         description: Email conflict.
 */
router.patch(
  "/supervisors/:user_id",
  authenticate,
  authorize(ROLES.ADMIN),
  updateSupervisorValidation,
  validate,
  updateSupervisor
);

/**
 * @openapi
 * /api/admin/supervisors/{user_id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Deactivate supervisor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     responses:
 *       200:
 *         description: Supervisor deactivated successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Supervisor not found.
 */
router.delete(
  "/supervisors/:user_id",
  authenticate,
  authorize(ROLES.ADMIN),
  userIdParamValidation,
  validate,
  deleteSupervisor
);

export default router;
