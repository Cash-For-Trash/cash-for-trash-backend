import * as AdminService from "../services/admin_services.js";
import { successResponse } from "../utils/response.js";

export const getCustomers = async (req, res, next) => {
  try {
    const result = await AdminService.getCustomers(req.query);
    return successResponse(res, "Customers retrieved successfully.", result, 200);
  } catch (error) {
    next(error);
  }
};

export const getCustomerDetails = async (req, res, next) => {
  try {
    const result = await AdminService.getCustomerDetails(req.params.user_id);
    return successResponse(res, "Customer details retrieved successfully.", result, 200);
  } catch (error) {
    next(error);
  }
};

export const getWorkers = async (req, res, next) => {
  try {
    const result = await AdminService.getWorkers(req.query);
    return successResponse(res, "Workers retrieved successfully.", result, 200);
  } catch (error) {
    next(error);
  }
};

export const getWorkerDetails = async (req, res, next) => {
  try {
    const result = await AdminService.getWorkerDetails(req.params.user_id);
    return successResponse(res, "Worker details retrieved successfully.", result, 200);
  } catch (error) {
    next(error);
  }
};
