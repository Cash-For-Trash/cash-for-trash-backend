import successResponse from '../utils/response.js';
import * as notificationService from '../services/notification_services.js';


// get all notifications for a user
export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const notifications = await notificationService.getNotificationsService(userId);
        return successResponse(res, 200, "Notifications fetched successfully.", notifications);
    } catch (error) {
        next(error);
    }
};


// get unread notifications count for a user
export const getUnreadNotificationsCount = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const count = await notificationService.getUnreadNotificationsCountService(userId);
        return successResponse(res, 200, "Unread notifications count fetched successfully.", { count });
    } catch (error) {
        next(error);
    }
};


// mark a notification as read
export const markNotificationAsRead = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const notificationId = req.params.notificationId;
        const notification = await notificationService.markNotificationAsReadService(userId, notificationId);
        return successResponse(res, 200, "Notification marked as read successfully.", notification);
    }
    catch (error) {
        next(error);
    }
};