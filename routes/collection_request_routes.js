import { Router } from "express";

import { createCollectionRequest, getCustomerCollectionRequest } from "../controllers/collection_request_controller.js";
import { getAvailableSlots } from "../controllers/address_controller.js";
import { createCollectionRequestValidation } from "../validations/collection_request_validation.js";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

/**
 * @openapi
 * /api/collection-requests/addresses/{address_id}/availabilities:
 *   get:
 *     summary: Get available collection slots by address
 *     tags:
 *       - Collection Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     responses:
 *       200:
 *         description: Available slots retrieved successfully.
 *       404:
 *         description: Address not found.
 *       400:
 *         description: Service unavailable in this area.
 */
router.get(
  "/addresses/:address_id/availabilities",
  authenticate,
  authorize(ROLES.CUSTOMER),
  getAvailableSlots
);

/**
 * @openapi
 * /api/collection-requests:
 *   post:
 *     summary: Create Collection Request
 *     tags:
 *       - Collection Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_id
 *               - availability_id
 *               - payment_method
 *               - quantity
 *               - garbage_types
 *             properties:
 *               address_id:
 *                 type: string
 *                 example: cmrkvmwr20000utr4aoa4fjeh
 *               availability_id:
 *                 type: string
 *                 example: cms0x7nz90001v1y85ddoefwp
 *               payment_method:
 *                 type: string
 *                 enum:
 *                   - CASH
 *                   - MONTHLY
 *                 example: CASH
 *               quantity:
 *                 type: number
 *                 example: 5.5
 *               collection_img:
 *                 type: string
 *                 example: https://example.com/trash.jpg
 *               garbage_types:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - garbage_type_id
 *                     - estimated_weight
 *                   properties:
 *                     garbage_type_id:
 *                       type: string
 *                       example: cmrkvmwr20000utr4aoa4f999
 *                     estimated_weight:
 *                       type: number
 *                       example: 2.5
 *     responses:
 *       201:
 *         description: Collection Request created successfully.
 *       400:
 *         description: Validation failed or inactive subscription.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Address, availability slot, or garbage type not found.
 */
router.post(
  "/",
  authenticate,
  authorize(ROLES.CUSTOMER),
  createCollectionRequestValidation,
  validate,
  createCollectionRequest
);
/**
 * @openapi
 * /api/collection-requests/my-collection-requests:
 *   get:
 *     summary: Get collection requests for customer
 *     tags:
 *       - Collection Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Collection requests retrieved successfully.
 *       404:
 *         description: Collection requests not found.
 */
router.get(
  "/my-collection-requests",
  authenticate,
  authorize(ROLES.CUSTOMER),
  getCustomerCollectionRequest
);

export default router;