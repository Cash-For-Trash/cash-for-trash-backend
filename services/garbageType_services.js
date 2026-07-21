
import AppError from "../utils/app_error.js";
import cloudinary from "../utils/cloudinary.js";
import prisma from "../config/db.js";
import fs from "fs"
// get all garbage types
export const getAllGarbageTypes = async () => {
    const garbageTypes=await prisma.garbageType.findMany();
    if(!garbageTypes || garbageTypes.length===0){
        throw new AppError("No garbage types found.", 404);
    }
    return garbageTypes;

}
// get garbage type by id
export const getGarbageType = async (garbageTypeId) => {
    const garbageTypes=await prisma.garbageType.findUnique({
        where: {
            garbage_type_id: garbageTypeId
        }
    });
    if(!garbageTypes){
        throw new AppError("Garbage type not found.", 404);
    }
    return garbageTypes;
}


// create garbage type
export const createGarbageType = async (createData,file) => {
    const garbageTypes=await prisma.garbageType.findFirst({
        where: {
            garbage_type_name: createData.garbage_type_name
        }
    });
    if(garbageTypes){
        throw new AppError("Garbage type already exists.", 400);
    }
  let imageUrl='https://res.cloudinary.com/mhqdl2ue/image/upload/v1784023360/girl_wq6pcl.jpg'
    
    const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "garbage-types",
    });
    imageUrl=uploadedImage.secure_url

    const newGarbageType = await prisma.garbageType.create({
        data: {
            garbage_type_name: createData.garbage_type_name,
            garbage_type_image: imageUrl,
            price_per_kg: Number(createData.price_per_kg),
        },
    });

    return newGarbageType;
};

// update garbage type by id
export const updateGarbageType = async (garbageTypeId, updateData ,file) => {
    const garbageTypes=await prisma.garbageType.findUnique({
        where: {
            garbage_type_id: garbageTypeId
        }
    });
    if(!garbageTypes){
        throw new AppError("Garbage type not found.", 404);
    }

    if (file) {

        const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: "garbage-types",
        });

        fs.unlinkSync(file.path);

        updateData.garbage_type_image = uploadedImage.secure_url;
    }

    const updatedGarbageType=await prisma.garbageType.update({
        where: {
            garbage_type_id: garbageTypeId
        },
        data: updateData
    });
    return updatedGarbageType;
}

// delete garbage type by id
export const deleteGarbageType = async (garbageTypeId) => {
    const garbageTypes=await prisma.garbageType.findUnique({
        where: {
            garbage_type_id: garbageTypeId
        }
    });
    if(!garbageTypes){
        throw new AppError("Garbage type not found.", 404);
    }
    await prisma.garbageType.delete({
        where: {
            garbage_type_id: garbageTypeId
        }
    });
    return;
}
