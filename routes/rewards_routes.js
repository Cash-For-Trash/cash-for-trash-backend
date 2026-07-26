import { Router } from "express";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";
import upload from "../middlewares/upload_middleware.js";
import {
    getAllRewardsController,
    getRewardController,
    addRewardController,
    updateRewardController,
    deleteRewardController,
} from "../controllers/rewards_controller.js";
import {
    createRewardValidation,
    updateRewardValidation,
} from "../validations/reward_validation.js";

const router = Router();

/**
 * @openapi
 * /api/rewards:
 *   get:
 *     tags:
 *       - Rewards
 *     summary: Get all rewards
 *     responses:
 *       200:
 *         description: Rewards fetched successfully.
 *       404:
 *         description: No rewards found.
 */
router.get("/", getAllRewardsController);

/*  *
 * @openapi
 * /api/rewards/{id}:
 *   get:
 *     tags:
 *       - Rewards
 *     summary: Get reward by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmcy2fxf0001abc123xyz
 *     responses:
 *       200:
 *         description: Reward retrieved successfully.
 *       404:
 *         description: Reward not found.
 */
router.get("/:id", getRewardController);

/**
 * @openapi
 * /api/rewards:
 *   post:
 *     tags:
 *       - Rewards
 *     summary: Create a new reward
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - required_points
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gift Card
 *               required_points:
 *                 type: number
 *                 example: 100
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Reward created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */
router.post(
    "/",
    authenticate,
    authorize(ROLES.ADMIN),
    upload.single("image"),
    createRewardValidation,
    validate,
    addRewardController
);

/**
 * @openapi
 * /api/rewards/{id}:
 *   put:
 *     tags:
 *       - Rewards
 *     summary: Update reward
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gift Card
 *               required_points:
 *                 type: number
 *                 example: 100
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Reward updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Reward not found.
 */
router.put(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    upload.single("image"),
    updateRewardValidation,
    validate,
    updateRewardController
);

/**
 * @openapi
 * /api/rewards/{id}:
 *   delete:
 *     tags:
 *       - Rewards
 *     summary: Delete reward
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
 *         description: Reward deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Reward not found.
 */
router.delete(
    "/:id",
    authenticate,
    authorize(ROLES.ADMIN),
    deleteRewardController
);

export default router;