import prisma from "../prisma/client";
import AppError from "../utils/appError";

// create a notification for a user
export const notificationService = async ({
  userId,
  title,
  message,
    type,
    relatedId=null
}
) => {
    const notification = await prisma.notification.create({
        data: {
            user_id: userId,
            title,
            message,
            type,
            related_id: relatedId,
        },
    });
    return notification;
}

// get all notifications for a user
export const getNotificationsService = async (userId) => {
    const user = await prisma.user.findUnique({
        where:{
            user_id: userId,
        },
    });
        
if (!user) {
        throw new AppError(
            "User not found.",
            404
        );
    }
    const notifications = await prisma.notification.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            created_at: "desc",
        },
    });
    return notifications;
}


//UnRead notifications count for a user
export const getUnreadNotificationsCountService = async (userId) => {
    const user = await prisma.user.findUnique({

        where: {
            user_id: userId,
        },
    });
    if (!user) {
        throw new AppError(
            "User not found.",
            404
        );
    }
    const unreadCount = await prisma.notification.count({
        where: {
            user_id: userId,
            is_read: false,
        },
    });
    return unreadCount;
}


// mark a notification as read
export const markNotificationAsReadService = async (userId, notificationId) => {
    const user = await prisma.user.findUnique({
        where: {
            user_id: userId,
        },
    });
    if (!user) {
        throw new AppError(
            "User not found.",
            404
        );
    }
    const notification = await prisma.notification.findFirst({
        where: {
            notification_id: notificationId,
            user_id: userId,
        },
    });
    if (!notification) {
        throw new AppError(
            "Notification not found.",
            404
        );
    }
    const updatedNotification = await prisma.notification.update({
        where: {
            notification_id: notificationId,
        },
        data: {
            is_read: true,
        },
    });
    return updatedNotification;
}