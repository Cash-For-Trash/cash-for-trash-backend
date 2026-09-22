import * as AdminService from "../services/admin_services.js";
import { successResponse,paginationResponse } from "../utils/response.js";

export const getCustomers = async (req, res, next) => {
  try {
    const result = await AdminService.getCustomers(req.query);
    return paginationResponse(res, "Customers retrieved successfully.",
      {
       page: result.page,
       page_size: result.page_size,
       total_items: result.total_items,
       total: result.total_pages
      }, result.data, 200);
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
    return paginationResponse(res, "Workers retrieved successfully.",
      {
       page: result.page,
       page_size: result.page_size,
       total_items: result.total_items,
       total: result.total_pages
      }, result.data, 200);
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


export const updatePointSettings = async (req, res, next) => {
  try {
    const updatedPointSetting = await AdminService.updatePointSettings(req.body);
return successResponse(res, "Point settings updated successfully.", updatedPointSetting, 200);
  }
  catch (error) {  
    next(error);
  }
};
