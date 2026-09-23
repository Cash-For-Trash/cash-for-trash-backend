import { Router } from "express";
import { createCollectionRequest, getCustomerCollectionRequest,getCustomerCollectionRequestDetails } from "../controllers/collection_request_controller.js";
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
 *           examples:
 *             mixed:
 *               summary: Mixed Waste Collection
 *               value:
 *                 request_type: MIXED
 *                 address_id: "cm123address"
 *                 availability_id: "cm123availability"
 *                 payment_method: CASH
 *                 quantity: 1
 *
 *             recyclable:
 *               summary: Recyclable Materials Collection
 *               value:
 *                 request_type: RECYCLABLE
 *                 address_id: "cm123address"
 *                 availability_id: "cm123availability"
 *                 garbage_types:
 *                   - garbage_type_id: "cm123plastic"
 *                     estimated_weight: 5
 *                   - garbage_type_id: "cm123paper"
 *                     estimated_weight: 3
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
 * /api/collection-requests/my-collection-requests?status={status}&page={page}&page_size={page_size}:
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


/**
 * @openapi
 * /api/collection-requests/{requestId}:
 *   get:
 *     summary: Get collection request details by ID
 *     tags:
 *       - Collection Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Collection request details retrieved successfully.
 *       404:
 *         description: Collection request not found.
 *       401:
 *         description: Authentication required.
 */

 router.get(
  "/:requestId",
  authenticate,
  authorize(ROLES.CUSTOMER),
  getCustomerCollectionRequestDetails 
);
export default router;