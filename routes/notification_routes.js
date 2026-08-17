import { Router } from "express"
import { authenticate } from "../middlewares/auth_middleware"
import {
    getNotificationsController,
    readNotificationController,
    getUnreadNotificationsCountController
} from "../controllers/notification_controller"

const router=Router()




/**
 * @openapi
 * /api/notification/my-notifications:
 *   get:
 *     summary: Get user notifications
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 */

router.get("/my-notifications", authenticate, getNotificationsController);




    /**
 * @openapi
 * /api/notification/{notification_id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags:
 *       - Notification
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 */

router.patch("/:notification_id/read", authenticate, readNotificationController);

/**
 * @openapi
 * /api/notification/my-notifications-count:
 *   get:
 *     summary: Get user notifications count
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications count fetched successfully
 */

router.get("/my-notifications-count", authenticate, getUnreadNotificationsCountController);
