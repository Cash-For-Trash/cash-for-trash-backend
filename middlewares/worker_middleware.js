import prisma from "../config/db.js";

import AppError from "../utils/app_error.js";

export const ensureApprovedWorker = async (
  req,
  res,
  next
) => {

  const worker = await prisma.worker.findUnique({
    where: {
      user_id: req.user.user_id,
    },
  });

  if (!worker) {
    return next(
      new AppError("Worker not found.", 404)
    );
  }

  if (!worker.is_approved) {
    return next(
      new AppError(
        "Your account is waiting for admin approval.",
        403
      )
    );
  }

  next();

};