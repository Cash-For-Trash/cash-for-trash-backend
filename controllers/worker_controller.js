import * as WorkerServices from "../services/worker_services.js";
import { successResponse } from "../utils/response.js";

export const approveWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const worker = await WorkerServices.approveWorker(id);
    return successResponse(
      res,
      "Worker approved successfully.",
      worker,
      200
    );
  } catch (error) {
    next(error);
  }
};


export const getWorkerCollectionRequest = async (req, res, next) => {
  try {
    const workerId  = req.user.user_id;
    const collectionRequests = await WorkerServices.getWorkerCollectionRequestService(workerId);
    return successResponse(
      res,  
    "Collection requests retrieved successfully.",
    collectionRequests,
    200
    );
  } catch (error) {
    next(error);
  }
};


export const getWorkerCollectionRequestDetails = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const workerId = req.user.user_id;
    const collectionRequestDetails = await WorkerServices.getWorkerCollectionRequestDetailsService(workerId, requestId);
    return successResponse(
      res,
      "Collection request details retrieved successfully.",
      collectionRequestDetails,
      200
    );
  } catch (error) {
    next(error);
  }
};
export const updateCollectionRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const workerId = req.user.user_id;
    const { garbages } = req.body;
    const result = await WorkerServices.updateCollectionRequestService(workerId, requestId, garbages);
    return successResponse(
      res,
      "Collection request updated successfully.",
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};
