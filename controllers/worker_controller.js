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