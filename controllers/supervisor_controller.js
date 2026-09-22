import * as SupervisorServices from "../services/supervisor_services.js";
import { successResponse } from "../utils/response.js";

export const createWorker = async (req, res, next) => {
  try {
    const worker = await SupervisorServices.createWorker(req.body);
    return successResponse(res, "Worker created successfully.", worker, 201);
  } catch (error) {
    next(error);
  }
};

export const getWorkers = async (req, res, next) => {
  try {
    const workers = await SupervisorServices.getWorkers(req.query);
    return successResponse(res, "Workers retrieved successfully.", workers, 200);
  } catch (error) {
    next(error);
  }
};

export const getWorkerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const worker = await SupervisorServices.getWorkerDetails(id);
    return successResponse(res, "Worker details retrieved successfully.", worker, 200);
  } catch (error) {
    next(error);
  }
};

export const updateWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const worker = await SupervisorServices.updateWorker(id, req.body);
    return successResponse(res, "Worker updated successfully.", worker, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await SupervisorServices.deleteWorker(id);
    return successResponse(res, "Worker deactivated successfully.", result, 200);
  } catch (error) {
    next(error);
  }
};
