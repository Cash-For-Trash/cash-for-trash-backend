
import { Router } from 'express';
const router = Router();
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { registerUserDeviceController } from '../controllers/userdevice_controller.js';
import { registerUserDeviceValidation } from '../validations/userdevice_validation.js';
/**
 * @openapi
 * /api/userdevice/register:
 *   post:
 *     summary: Register user device
 *     tags:
 *       - UserDevice
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fcm_token:
 *                 type: string
 *                 example: cmrkvmwr20000utr4aoa4fjeh
 *               device_type:
 *                 type: string
 *                 example: android
 *     responses:
 *       200:
 *         description: User device registered successfully.
 *       404:
 *         description: User device not found.
 *       409:
 *         description: User device already registered.
 */

router.post(
    '/register',
    authenticate,
    registerUserDeviceValidation,
    validate,
    registerUserDeviceController
);

export default router;