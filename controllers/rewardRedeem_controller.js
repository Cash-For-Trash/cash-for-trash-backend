import * as RewardRedeemService from "../services/rewardRedeem_services.js";
import {successResponse} from "../utils/response.js";

// make redemption request
export const createRewardRedeemRequestController = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const { reward_id } = req.params;
        const redemption = await RewardRedeemService.makeRewardRedeemRequestService(user_id, reward_id);
        return successResponse(res, "Redemption request created successfully.", redemption, 201);
    } catch (error) {
      next(error);
    }
};

// get all redemption requests
export const getAllRedemptionRequestsController = async (req, res, next) => {
    try {
        const redemptions = await RewardRedeemService.getAllRedemptionRequestsService();
        return successResponse(res, "Redemption requests fetched successfully.", redemptions, 200);
    } catch (error) {
        next(error);
    }
};

// approve redemption request
export const approveRedemptionRequestController = async (req, res, next) => {
    try {
        const { redemption_id } = req.params;
        const updatedRedemption = await RewardRedeemService.approveRedemptionRequestService(redemption_id);
        return successResponse(res, "Redemption request approved successfully.", updatedRedemption, 200);
    } catch (error) {
      next(error);
    }
};

// reject redemption request
export const rejectRedemptionRequestController = async (req, res, next) => {
    try {
        const { redemption_id } = req.params;
        const result = await RewardRedeemService.rejectRedemptionRequestService(redemption_id);
        return successResponse(res, "Redemption request rejected successfully.", result, 200);
    } catch (error) {
      next(error);
    }
};

// get my redemptions
export const getMyRedemptionsController = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const redemptions = await RewardRedeemService.getMyRedemptionsService(user_id);
        return successResponse(res, "My redemptions fetched successfully.", redemptions, 200);
    } catch (error) {
      next(error);
    }
};

// get points transaction history
export const getPointsTransactionHistoryController = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const transactions = await RewardRedeemService.getPointsTransactionHistoryService(user_id);
        return successResponse(
            res,
            "Points transaction history fetched successfully.",
            transactions,
            200
        );
    } catch (error) {
      next(error);
    }
};
