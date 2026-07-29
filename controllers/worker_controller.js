import * as WorkerService from "../services/worker_service.js";
import { successResponse } from "../utils/response.js";

export const approveWorker = async (req, res, next) => {

    try {

        const { id } = req.params;

        const worker =
            await WorkerService.approveWorker(id);

        successResponse(

            res,

            "Worker approved successfully.",

            worker,

            200

        );

    }

    catch (error) {

        next(error);

    }

};