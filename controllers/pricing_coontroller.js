import * as PricingService from "../services/pricing_services.js";
import { successResponse } from "../utils/response.js";

export const getPricingSettings = async (req,res,next)=>{

try{

const settings =
await PricingService.getPricingSettings();

successResponse(

res,
"Pricing settings retrieved successfully.",
settings

);

}catch(error){

next(error);

}

};

export const updatePricingSettings = async (req,res,next)=>{

try{

const settings =
await PricingService.updatePricingSettings(req.body);

successResponse(

res,
"Pricing settings updated successfully.",
settings

);

}catch(error){

next(error);

}

};
