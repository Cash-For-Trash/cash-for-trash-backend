import * as areaService from "../services/area_services.js";
import { successResponse } from "../utils/response.js";

export const createArea = async(req,res,next)=>{

    try{

        const result =
            await areaService.createArea(
                req.body
            );

        return successResponse(
            res,
            "Area created successfully.",
            result,
            201
        );

    }catch(error){

        next(error);

    }

};

export const getAllAreas = async (
    req,
    res,
    next
) => {

    try {

        const areas = await areaService.getAllAreas(req.query);

        return successResponse(

            res,

            "Areas retrieved successfully.",

            areas

        );

    }

    catch(error){

        next(error);

    }

};

export const getAreaById = async (

    req,

    res,

    next

) => {

    try{

        const area =
            await areaService.getAreaById(

                req.params.id

            );

        return successResponse(

            res,

            "Area retrieved successfully.",

            area

        );

    }

    catch(error){

        next(error);

    }

};

export const updateArea = async (

    req,

    res,

    next

) => {

    try{

        const area =
            await areaService.updateArea(

                req.params.id,

                req.body

            );

        return successResponse(

            res,

            "Area updated successfully.",

            area

        );

    }

    catch(error){

        next(error);

    }

};

export const deleteArea = async (

    req,

    res,

    next

) => {

    try{

        await areaService.deleteArea(

            req.params.id

        );

        return successResponse(

            res,

            "Area deleted successfully."

        );

    }

    catch(error){

        next(error);

    }

};