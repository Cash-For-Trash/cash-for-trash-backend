import prisma from "../config/db.js";
import AppError from '../utils/app_error.js';

// Register user device
export const registerUserDevice = async (user_id, fcm_token, device_type) => {
    try {
        const existingDevice = await prisma.userDevice.findFirst({
            where: {
                user_id: user_id,
                fcm_token: fcm_token,
            },
        });

        if (existingDevice) {
            return existingDevice;
        }

        const newDevice = await prisma.userDevice.create({
            data: {
                user_id: user_id,
                fcm_token: fcm_token,
                device_type: device_type,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return newDevice;

    } catch (error) {
        throw new AppError('Failed to register user device', 500);
    }
};