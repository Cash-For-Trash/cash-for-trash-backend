import * as PricingServices from "../services/pricing_services.js";
import { successResponse } from "../utils/response.js";

export const getPricingSettings = async (req, res, next) => {
  try {
    const settings = await PricingServices.getPricingSettings();
    return successResponse(
      res,
      "Pricing settings retrieved successfully.",
      settings,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const updatePricingSettings = async (req, res, next) => {
  try {
    const settings = await PricingServices.updatePricingSettings(req.body);
    return successResponse(
      res,
      "Pricing settings updated successfully.",
      settings,
      200
    );
  } catch (error) {
    next(error);
  }
};
