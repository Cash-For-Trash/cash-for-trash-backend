import { successResponse } from '../utils/response.js';
import * as notificationService from '../services/notification_services.js';


// get all notifications for a user
export const getNotificationsController = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const notifications = await notificationService.getNotificationsService(userId);
        return successResponse(res, "Notifications fetched successfully.", notifications, 200);
    } catch (error) {
        next(error);
    }
};


// get unread notifications count for a user
export const getUnreadNotificationsCountController = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const count = await notificationService.getUnreadNotificationsCountService(userId);
        return successResponse(res, "Unread notifications count fetched successfully.", { count }, 200);
    } catch (error) {
        next(error);
    }
};


// mark a notification as read
export const readNotificationController = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const notificationId = req.params.notification_id;
        const notification = await notificationService.markNotificationAsReadService(userId, notificationId);
        return successResponse(res, "Notification marked as read successfully.", notification, 200);
    }
    catch (error) {
        next(error);
    }
};