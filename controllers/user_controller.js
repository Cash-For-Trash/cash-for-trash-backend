import * as UserService from '../services/user_services.js';
import { successResponse } from '../utils/response.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const userProfile = await UserService.getUserProfile(req.user.user_id);
    successResponse({
        res,
        message: 'User profile retrieved successfully.',
        data: userProfile,
        statusCode: 200,
      });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile= async (req, res, next) => {
  try {
    const { first_name, last_name, telephone , image} = req.body;
    const updateData = {
      first_name,
      last_name,
      telephone,
      image,
    };
    const updatedUserProfile = await UserService.updateUserProfile(req.user.user_id, updateData);
    successResponse({
        res,
        message: 'User profile updated successfully.',
        data: updatedUserProfile,
        statusCode: 200,
      });
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (req, res, next) => {
  try {
    const deletedUserProfile = await UserService.deleteUserProfile(req.user.user_id);
    successResponse({
        res,
        message: 'User profile deleted successfully.',
        statusCode: 200,
      });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await UserService.ChangePassword(req.user.user_id, oldPassword, newPassword);
    successResponse({
      res,
      message: 'Password changed successfully.',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
};
