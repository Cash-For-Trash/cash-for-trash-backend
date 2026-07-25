import * as availabilityService from "../services/availability_service.js";
import asyncHandler from "../middlewares/error_middleware.js";
import { successResponse } from "../utils/response.js";

export const createAvailability = asyncHandler(async (req, res) => {

    const availability = await availabilityService.createAvailability(

        req.user.user_id,

        req.body

    );

    
   const response = {
    ...availability,
    from_time: availability.from_time.toISOString().substring(11, 19),
    to_time: availability.to_time.toISOString().substring(11, 19)
    };

    return successResponse(
        res,
        response,
        "Availability created successfully.",
        201
    );

});