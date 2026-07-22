import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { ROLES } from "../utils/constants.js";
// Get all addresses 
export const getAllAddresses = async (userId) => {
  const addresses = await prisma.address.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
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
  const newAddress = await prisma.address.create({
    data: {
    ...addressData,
      user_id: userId,
    },
  });

  return newAddress;
};

 // Update the address

export const updateAddress = async (addressId, userId, updateData) => {
  const address = await prisma.address.findFirst({
    where: {
      address_id: addressId,
      user_id: userId,
    },
  });

  if (!address) {
    throw new AppError("Address not found.", 404);
  }

 
  const updatedAddress = await prisma.address.update({
    where: {
      address_id: addressId,
    },
    data: {
      ...updateData,
    },
  });

  return updatedAddress;
};
// Delete address
export const deleteAddress = async (addressId, userId,role) => {

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

    await prisma.address.delete({
    where: {
      address_id: addressId,
    },
  });
  return;
};