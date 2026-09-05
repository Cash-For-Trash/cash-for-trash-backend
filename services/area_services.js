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

let north_lat = Number(data.north_lat);
let south_lat = Number(data.south_lat);
let east_lng = Number(data.east_lng);
let west_lng = Number(data.west_lng);

if (north_lat === south_lat) {
    throw new AppError(
        "Invalid latitude boundaries.",
        400
    );
}

if (east_lng === west_lng) {
    throw new AppError(
        "Invalid longitude boundaries.",
        400
    );
}

if (north_lat < south_lat) {
    [north_lat, south_lat] = [south_lat, north_lat];
}

if (east_lng < west_lng) {
    [east_lng, west_lng] = [west_lng, east_lng];
}

const area = await prisma.area.create({
    data: {
        ...data,
        north_lat,
        south_lat,
        east_lng,
        west_lng,
    }
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

    const existingArea = await getAreaById(area_id);

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

    if (
        updatedData.north_lat !== undefined ||
        updatedData.south_lat !== undefined ||
        updatedData.east_lng !== undefined ||
        updatedData.west_lng !== undefined
    ) {
        let north_lat = Number(updatedData.north_lat ?? existingArea.north_lat);
        let south_lat = Number(updatedData.south_lat ?? existingArea.south_lat);
        let east_lng = Number(updatedData.east_lng ?? existingArea.east_lng);
        let west_lng = Number(updatedData.west_lng ?? existingArea.west_lng);

        if (north_lat === south_lat) {
            throw new AppError("Invalid latitude boundaries.", 400);
        }
        if (east_lng === west_lng) {
            throw new AppError("Invalid longitude boundaries.", 400);
        }

        if (north_lat < south_lat) {
            [north_lat, south_lat] = [south_lat, north_lat];
        }
        if (east_lng < west_lng) {
            [east_lng, west_lng] = [west_lng, east_lng];
        }

        updatedData.north_lat = north_lat;
        updatedData.south_lat = south_lat;
        updatedData.east_lng = east_lng;
        updatedData.west_lng = west_lng;
    }

    if (updatedData.name) {

    const duplicateName = await prisma.area.findFirst({

        where: {
            name: updatedData.name,
            NOT: {
                area_id
            }
        }

    });

    if (duplicateName) {
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

export const updateAreaPrice = async (
    areaId,
    servicePrice
) => {

    const area = await prisma.area.findUnique({

        where: {

            area_id: areaId

        }

    });

    if (!area) {

        throw new AppError(

            "Area not found.",

            404

        );

    }

    const updatedArea = await prisma.area.update({

        where: {

            area_id: areaId

        },

        data: {

            service_price: servicePrice

        }

    });

    return updatedArea;

};
