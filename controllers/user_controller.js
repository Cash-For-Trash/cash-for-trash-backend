import * as UserService from '../services/user_services.js';
import { successResponse } from '../utils/response.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const userProfile = await UserService.getUserProfile(req.user.user_id);
    successResponse(res, 'User profile retrieved successfully.', userProfile, 200);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile= async (req, res, next) => {
  try {
    const { first_name, last_name, mobile, image } = req.body;
    const updateData = {
      first_name,
      last_name,
      mobile,
      image,
    };
    const updatedUserProfile = await UserService.updateUserProfile(req.user.user_id, updateData);
    successResponse(res, 'User profile updated successfully.', updatedUserProfile, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (req, res, next) => {
  try {
    await UserService.deleteUserProfile(req.user.user_id);
    successResponse(res, 'User profile deleted successfully.', null, 200);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        await UserService.ChangePassword(
            req.user.user_id,
            oldPassword,
            newPassword,
            confirmPassword
        );

        successResponse(
            res,
            "Password changed successfully.",
            null,
            200
        );
    } catch (error) {
        next(error);
    }
};
