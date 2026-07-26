import { successResponse } from "../utils/response.js";
import * as rewardService from "../services/rewards_services.js";

// Get all rewards
export const getAllRewardsController = async (req, res, next) => {
  try {
    const rewards = await rewardService.getAllRewardsService();

    return successResponse(
      res,
      "Rewards fetched successfully",
      rewards,
      200
    );
  } catch (err) {
    next(err);
  }
};

// Get reward by id
export const getRewardController = async (req, res, next) => {
  try {
    const reward = await rewardService.getRewardService(req.params.id);

    return successResponse(
      res,
      "Reward fetched successfully",
      reward,
      200
    );
  } catch (err) {
    next(err);
  }
};

// Create reward
export const addRewardController = async (req, res, next) => {
  try {
    const reward = await rewardService.createRewardService(
      req.body,
      req.file
    );

    return successResponse(
      res,
      "Reward added successfully",
      reward,
      201
    );
  } catch (err) {
    next(err);
  }
};

// Update reward
export const updateRewardController = async (req, res, next) => {
  try {
    const reward = await rewardService.updateRewardService(
      req.params.id,
      req.body,
      req.file
    );

    return successResponse(
      res,
      "Reward updated successfully",
      reward,
      200
    );
  } catch (err) {
    next(err);
  }
};

// Delete reward
export const deleteRewardController = async (req, res, next) => {
  try {
    await rewardService.deleteRewardService(req.params.id);

    return successResponse(
      res,
      "Reward deleted successfully",
      null,
      200
    );
  } catch (err) {
    next(err);
  }
};