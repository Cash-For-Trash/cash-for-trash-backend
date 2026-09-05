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

export const getCollectionRequestByStatus = async (req, res, next) => {
  try {
    const workerId = req.user.user_id;
    const { status } = req.params;
    const collectionRequests = await WorkerServices.getCollectionRequestFilterByStatusService(workerId, status);
    return successResponse(
      res,
      `Collection requests for status ${status.toLowerCase()} retrieved successfully.`,
      collectionRequests,
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
    const { requestGarbages } = req.body;
    const result = await WorkerServices.addActualWeightService(workerId, requestId, requestGarbages);
    return successResponse(
      res,
      "Actual weight added successfully and collection request marked as collected",
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};
