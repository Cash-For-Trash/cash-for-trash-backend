import * as CustomerServices from "../services/customer_services.js";
import { successResponse } from "../utils/response.js";

export const getCustomerPoints = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await CustomerServices.getCustomerPoints(userId);
    return successResponse(
      res,
      "Customer points retrieved successfully.",
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const getCustomerLeaderBoard = async (req, res, next) => {
  try {
    const result = await CustomerServices.getCustomerLeaderships();
    return successResponse(
      res,
      "Customers Leaderboard retrieved successfully.",
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};



