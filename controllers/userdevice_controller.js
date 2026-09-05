import { successResponse } from '../utils/response.js'
import { registerUserDevice } from '../services/userdevice_services.js'

export const registerUserDeviceController = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const { fcm_token, device_type } = req.body;
        const device = await registerUserDevice(user_id, fcm_token, device_type);
        return successResponse(res, 'User device registered successfully', device, 200);
    } catch (error) {
        next(error);
    }
}