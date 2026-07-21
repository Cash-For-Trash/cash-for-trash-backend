import * as garbageTypeServices from '../services/garbageType_services.js';
import { successResponse } from '../utils/response.js';


export const getAllGarbageTypes=async(req,res,next)=>{
    try {
        const garbageTypes=await garbageTypeServices.getAllGarbageTypes();
        successResponse(res, 'Garbage types retrieved successfully.', garbageTypes, 200);
    }
    catch (error) {
        next(error);
    }
}

// get garbage type by id
export const getGarbageType=async(req,res,next)=>{
    try {   
        const { id } = req.params;
        const garbageType = await garbageTypeServices.getGarbageType(id);
        successResponse(res, 'Garbage type retrieved successfully.', garbageType, 200);
    }
    catch (error) {
        next(error);
    }
}

export const createGarbageType=async(req,res,next)=>{
    try {   
        const createData = req.body;
    
        const newGarbageType = await garbageTypeServices.createGarbageType(createData,req.file);
        successResponse(res, 'Garbage type created successfully.', newGarbageType, 201);
    }
    catch (error) {
        next(error);
    }
}

// update garbage type by id
export const updateGarbageType=async(req,res,next)=>{
    try {   
        const { id } = req.params;
        const updateData = req.body;
        const updatedGarbageType = await garbageTypeServices.updateGarbageType(id, updateData,req.file);
        successResponse(res, 'Garbage type updated successfully.', updatedGarbageType, 200);
    }
    catch (error) {
        next(error);
    }
}
// delete garbage type by id
export const deleteGarbageType=async(req,res,next)=>{
    try {   
        const { id } = req.params;
        await garbageTypeServices.deleteGarbageType(id);
        successResponse(res, 'Garbage type deleted successfully.', null, 200);
    }
    catch (error) {
        next(error);
    }
}