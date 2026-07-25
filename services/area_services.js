import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";

export const createArea = async(data)=>{
const existingArea = await prisma.area.findUnique({
    where:{
        name:data.name
    }
});

if(existingArea){

    throw new AppError(
        "Area already exists.",
        409
    );

}

if(data.north_lat <= data.south_lat){

    throw new AppError(
        "Invalid latitude boundaries.",
        400
    );

}

if(data.east_lng <= data.west_lng){

    throw new AppError(
        "Invalid longitude boundaries.",
        400
    );

}

const area = await prisma.area.create({

    data

});

return area;
}

export const getAllAreas = async (query) => {

    const search = query.search?.trim();

    return await prisma.area.findMany({

        where: search
            ? {
                  name: {
                      contains: search,
                  },
              }
            : {},

        orderBy: {
            name: "asc",
        },

    });

};

export const getAreaById = async (
    area_id
) => {

    const area =
        await prisma.area.findUnique({

            where: {
                area_id
            }

        });

    if(!area){

        throw new AppError(
            "Area not found.",
            404
        );

    }

    return area;

};

export const updateArea = async (
    area_id,
    data
) => {

    await getAreaById(area_id);

    const updatedData = Object.fromEntries(
        Object.entries(data).filter(
            ([_, value]) => value !== undefined
        )
    );

    if (Object.keys(updatedData).length === 0) {
        throw new AppError(
            "No data provided to update.",
            400
        );
    }
if (updatedData.name) {

    const existingArea = await prisma.area.findFirst({

        where: {
            name: updatedData.name,
            NOT: {
                area_id
            }
        }

    });

    if (existingArea) {
        throw new AppError(
            "Area name already exists.",
            409
        );
    }

   }
    return await prisma.area.update({

        where: {
            area_id
        },

        data: updatedData

    });

};

export const deleteArea = async (

    area_id

) => {

    await getAreaById(area_id);

    await prisma.area.delete({

        where:{

            area_id

        }

    });

};
