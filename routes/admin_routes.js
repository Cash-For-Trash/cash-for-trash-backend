import { Router } from "express";
import {
  getCustomers,
  getCustomerDetails,
  getWorkers,
  getWorkerDetails,
} from "../controllers/admin_controller.js";
import {
  getListValidation,
  userIdParamValidation,
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
 *         description: Page number
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 10
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
 *         description: Page number
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 10
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

export default router;
