import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { ROLES } from "../utils/constants.js";
import { formatTime } from "../utils/time.js";

const findAreasByCoordinates = async (latitude, longitude) => {

    const areas = await prisma.area.findMany({

        where:{

            is_active:true,

            north_lat:{
                gte:latitude
            },

            south_lat:{
                lte:latitude
            },

            east_lng:{
                gte:longitude
            },

            west_lng:{
                lte:longitude
            }

        }

    });

    return areas;

};

// get All Addresses for all customers
export const getAllAddressesForAdmins = async () => {
    const addresses = await prisma.address.findMany({
        include: {
            user: true,
        },
        orderBy: {
            updated_at: "desc",
        },
    });
    return addresses;
};

// Get all addresses 
export const getAllAddresses = async (userId) => {
  const addresses = await prisma.address.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      updated_at: "desc",
    },
  });

  return addresses;
};

// Get address by id
export const getAddressById = async (addressId, userId,role) => {
 
    const where =
    role === ROLES.ADMIN
      ? { address_id: addressId }
      : {
          address_id: addressId,
          user_id: userId,
        };

  const address = await prisma.address.findFirst({
    where,
  });

  if (!address) {
    throw new AppError("Address not found.", 404);
  }

  return address;
};

// Create new address
export const createAddress = async (userId, addressData) => {

    const {

        latitude,
        longitude

    } = addressData;

    // Check duplicate

    const existingAddress =
    await prisma.address.findFirst({

        where:{

            user_id:userId,

            latitude,

            longitude

        }

    });

    if(existingAddress){

        throw new AppError(
            "Address already exists.",
            409
        );

    }

    // Check service area

    const areas =
    await findAreasByCoordinates(
        latitude,
        longitude
    );

    if(!areas || areas.length === 0){

        throw new AppError(
            "Service is not available in this location.",
            404
        );

    }

    const address =
    await prisma.address.create({

        data:{

            ...addressData,

            user_id:userId

            // area_id later

        }

    });

    return address;

};

 // Update the address
export const updateAddress = async (
    addressId,
    userId,
    updateData
) => {

    // Empty Body

    if(Object.keys(updateData).length === 0){

        throw new AppError(
            "No data provided.",
            400
        );

    }

    const address =
    await prisma.address.findFirst({

        where:{

            address_id:addressId,

            user_id:userId

        }

    });

    if(!address){

        throw new AppError(
            "Address not found.",
            404
        );

    }

    // Check Area Again
    if(
        updateData.latitude !== undefined ||
        updateData.longitude !== undefined
    ){

        const latitude =
            updateData.latitude ?? address.latitude;

        const longitude =
            updateData.longitude ?? address.longitude;

        const areas =
        await findAreasByCoordinates(
            latitude,
            longitude
        );

        if(!areas || areas.length === 0){

            throw new AppError(
                "Service is not available in this location.",
                404
            );

        }

        // Duplicate Check

        const duplicate =
        await prisma.address.findFirst({

            where:{

                user_id:userId,

                latitude,

                longitude,

                NOT:{
                    address_id:addressId
                }

            }

        });

        if(duplicate){

            throw new AppError(
                "Address already exists.",
                409
            );

        }

    }

    const updatedAddress =
    await prisma.address.update({

        where:{
            address_id:addressId
        },

        data:updateData

    });

    return updatedAddress;

};

export const deleteAddress = async (
    addressId,
    userId,
    role
) => {

    const where =
        role === ROLES.ADMIN
            ? {
                address_id: addressId
            }
            : {
                address_id: addressId,
                user_id: userId
            };

    const address =
    await prisma.address.findFirst({

        where

    });

    if(!address){

        throw new AppError(
            "Address not found.",
            404
        );

    }

    // Last Address Rule

    if(role !== ROLES.ADMIN){

        const addressesCount =
        await prisma.address.count({

            where:{
                user_id:userId
            }

        });

        if(addressesCount === 1){

            throw new AppError(
                "You must have at least one address.",
                400
            );

        }

    }

    // Active Requests Rule

    const activeRequest =
    await prisma.collectionRequest.findFirst({

        where:{

            address_id:addressId,

            status:{
                in:[
                    "PENDING",
                    "NEEDS_RESCHEDULE",
                    "ACCEPTED",
                    "ON_THE_WAY"
                ]
            }

        }

    });

    if(activeRequest){

        throw new AppError(
            "This address has active collection requests.",
            400
        );

    }

    await prisma.address.delete({

        where:{
            address_id:addressId
        }

    });

};

export const getAvailableSlots = async (
    userId,
    address_id
) => {

    const address = await prisma.address.findFirst({

        where:{

            address_id,

            user_id:userId

        }

    });

    if(!address){

        throw new AppError(
            "Address not found.",
            404
        );

    }

    const areas = await findAreasByCoordinates(

        address.latitude,
        address.longitude

    );

    if(!areas || areas.length === 0){

        throw new AppError(
            "Service is unavailable in your area.",
            400
        );

    }

    const areaIds = areas.map((area) => area.area_id);

    const slots = await prisma.availability.findMany({

        where:{

            area_id: { in: areaIds },

            workerAvailabilities:{

                some:{

                    worker:{

                        is_approved:true

                    }

                }

            }

        },

        include:{
            area:true
        },

        orderBy:[

            {
                day_of_week:"asc"
            },

            {
                from_time:"asc"
            }

        ]

    });

    return slots.map(slot => ({

        availability_id:slot.availability_id,

        day:slot.day_of_week,

        from:formatTime(slot.from_time),

        to:formatTime(slot.to_time),

        service_price: Number(slot.area?.service_price || 0)

    }));

};