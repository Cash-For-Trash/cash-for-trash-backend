import { Router } from "express";
import { createRewardRedeemRequestController, getAllRedemptionRequestsController, getMyRedemptionsController, approveRedemptionRequestController, rejectRedemptionRequestController } from "../controllers/rewardRedeem_controller.js";
import { authenticate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";
const router = Router();


/**
 * @openapi
 * /api/reward-redeems/{reward_id}:
 *   post:
 *     tags:
 *       - Reward Redeems
 *     summary: Make a reward redeem request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reward_id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmcy2fxf0001abc123xyz
 *     responses:
 *       201:
 *         description: Reward redeem request created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */
router.post("/:reward_id",
    authenticate,  
    createRewardRedeemRequestController);

/**
 * @openapi
 * /api/reward-redeems:
 *   get:
 *     tags:
 *       - Reward Redeems
 *     summary: Get all reward redeem requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reward redeem requests fetched successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", 
    authenticate,
    authorize(ROLES.ADMIN),
    getAllRedemptionRequestsController);

/**
 * @openapi
 * /api/reward-redeems/my_redemptions:
 *   get:
 *     tags:
 *       - Reward Redeems
 *     summary: Get all my reward redeem requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reward redeem requests fetched successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/my_redemptions", 
    authenticate,
    
        getMyRedemptionsController);

/**
 * @openapi
 * /api/reward-redeems/approve/{redemption_id}:
 *   put:
 *     tags:
 *       - Reward Redeems
 *     summary: Approve a reward redeem request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: redemption_id
 *         schema:
 *           type: string
 *         required: true
 *         example: cmcy2fxf0001abc123xyz
 *         description: Redemption ID
 *     responses:
 *       200:
 *         description: Reward redeem request approved successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */
router.put("/approve/:redemption_id", 
    authenticate,
    authorize(ROLES.ADMIN), 
    approveRedemptionRequestController);

/**
 * @openapi
 * /api/reward-redeems/reject/{redemption_id}:
 *   put:
 *     tags:
 *       - Reward Redeems
 *     summary: Reject a reward redeem request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: redemption_id
 *         schema:
 *           type: string
 *         required: true
 *         example: cmcy2fxf0001abc123xyz
 *         description: Redemption ID
 *     responses:
 *       200:
 *         description: Reward redeem request rejected successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */
router.put("/reject/:redemption_id", 
    authenticate,
    authorize(ROLES.ADMIN), 
    rejectRedemptionRequestController);

export default router;