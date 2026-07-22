import * as AddressServices from "../services/address_services.js";
import { successResponse } from "../utils/response.js";

// Get all addresses 
export const getAllUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const addresses = await AddressServices.getAllAddresses(userId);

    successResponse(
      res,
      "Addresses retrieved successfully.",
      addresses,
      200
    );
  } catch (error) {
    next(error);
  }
};

// Get address by id
export const getUserAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const role=req.user.role;

    const address = await AddressServices.getAddressById(id, userId,role);

    successResponse(
      res,
      "Address retrieved successfully.",
      address,
      200
    );
  } catch (error) {
    next(error);
  }
};

// Create address
export const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const newAddress = await AddressServices.createAddress(
      userId,
      req.body
    );

    successResponse(
      res,
      "Address created successfully.",
      newAddress,
      201
    );
  } catch (error) {
    next(error);
  }
};

// Update address
export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const updatedAddress = await AddressServices.updateAddress(
      id,
      userId,
      req.body
    );

    successResponse(
      res,
      "Address updated successfully.",
      updatedAddress,
      200
    );
  } catch (error) {
    next(error);
  }
};

// Delete address
export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
     const role=req.user.role;
    await AddressServices.deleteAddress(id, userId,role);

    successResponse(
      res,
      "Address deleted successfully.",
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};