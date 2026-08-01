import * as AvailabilityServices from "../services/availability_services.js";
import { successResponse } from "../utils/response.js";

export const createAvailability = async (req, res, next) => {
  try {
    const availability = await AvailabilityServices.createAvailability(
      req.user.user_id,
      req.body
    );

    const responseData = {
      ...availability,
      from_time: availability.from_time instanceof Date ? availability.from_time.toISOString().substring(11, 19) : availability.from_time,
      to_time: availability.to_time instanceof Date ? availability.to_time.toISOString().substring(11, 19) : availability.to_time,
    };

    return successResponse(
      res,
      "Availability created successfully.",
      responseData,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getMyAvailabilities = async (req, res, next) => {
  try {
    const data = await AvailabilityServices.getMyAvailabilities(
      req.user.user_id
    );

    return successResponse(
      res,
      "Availabilities retrieved successfully.",
      data,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const availability = await AvailabilityServices.updateAvailability(
      req.user.user_id,
      req.params.availability_id,
      req.body
    );

    return successResponse(
      res,
      "Availability updated successfully.",
      availability,
      200
    );
  } catch (error) {
    next(error);
  }
};