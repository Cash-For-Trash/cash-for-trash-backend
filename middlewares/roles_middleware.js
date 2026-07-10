import AppError from "../utils/app_error.js";

export const authorize = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

      return next(
        new AppError("Access denied.", 403)
      );

    }

    next();

  };

};