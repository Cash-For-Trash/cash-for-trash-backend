import AppError from "../utils/app_error.js";
import { ROLES } from "../utils/constants.js";

export const resolveTargetWorker = (req, res, next) => {
  if (req.user.role === ROLES.SUPERVISOR || req.user.role === ROLES.ADMIN) {
    const targetWorkerId = req.params.workerId || req.query.workerId || req.body.workerId;
    if (!targetWorkerId) {
      return next(new AppError("Worker ID parameter is required for supervisor access.", 400));
    }
    req.targetWorkerId = targetWorkerId;
  } else {
    req.targetWorkerId = req.user.user_id;
  }
  next();
};
