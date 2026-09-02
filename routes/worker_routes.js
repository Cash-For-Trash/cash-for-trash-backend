import { Router } from "express";
import { approveWorker, getWorkerCollectionRequest,getWorkerCollectionRequestDetails,getCollectionRequestByStatus,updateCollectionRequest } from "../controllers/worker_controller.js";
import { ROLES } from "../utils/constants.js";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { addActualWeightValidation , getCollectionRequestByStatusValidation ,approveWorkerValidation,} from "../validations/worker_validation.js";
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

/**
 * @openapi
 * /api/workers/collection-requests:
 *   get:
 *     summary: Get worker collection requests
 *     tags:
 *       - Worker
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Worker collection requests.
 *       404:
 *         description: Worker collection requests not found.
 */

router.get(
  "/collection-requests",
  authenticate,
  authorize(ROLES.WORKER),
getWorkerCollectionRequest
);

/**
 * @openapi
 * /api/workers/collection-requests/{requestId}:
 *   get:
 *     summary: Get worker collection requests details by request id
 *     tags:
 *       - Worker
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     responses:
 *       200:
 *         description: Worker collection requests details by request id.
 *       404:
 *         description: Worker collection requests details by request id not found.
 */

router.get(
  "/collection-requests/:requestId",
  authenticate,
  authorize(ROLES.WORKER),
  getWorkerCollectionRequestDetails
);

/**
 * @openapi
 * /api/workers/collection-requests/{requestId}:
 *   patch:
 *     summary: Update worker collection requests details by request id
 *     tags:
 *       - Worker
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
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
 *             required:
 *               - garbages
 *             properties:
 *               garbages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - request_garbage_id
 *                     - actual_weight
 *                   properties:
 *                     request_garbage_id:
 *                       type: string
 *                       example: cmrkvmwr20000utr4aoa4fjeh
 *                     actual_weight:
 *                       type: number
 *                       example: 10
 *     responses:
 *       200:
 *         description: Worker collection requests details by request id.
 *       404:
 *         description: Worker collection requests details by request id not found.
 */

router.patch(
  "/collection-requests/:requestId",
  authenticate,
  authorize(ROLES.WORKER),
  addActualWeightValidation,
  validate, 
  updateCollectionRequest
);

/**
 * @openapi
 * /api/workers/collection-requests/status/{status}:
 *   get:
 *     summary: Get worker collection requests by status
 *     tags:
 *       - Worker
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         example: PENDING
 *     responses:
 *       200:
 *         description: Worker collection requests by status.
 *       404:
 *         description: Worker collection requests by status not found.
 */

router.get(
  "/collection-requests/status/:status",
  authenticate,
  authorize(ROLES.WORKER),
  getCollectionRequestByStatusValidation,
  validate,
  getCollectionRequestByStatus
);



export default router;