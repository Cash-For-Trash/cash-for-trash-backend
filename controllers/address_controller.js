import * as AddressServices from "../services/address_services.js";
import { successResponse } from "../utils/response.js";

export const getAllAddressesForAdminsController = async (req, res, next) => {
  try {
    const addresses = await AddressServices.getAllAddressesForAdmins();
    return successResponse(
      res,
      "Addresses retrieved successfully.",
      addresses,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const getAllUserAddresses = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const addresses = await AddressServices.getAllAddresses(userId);
    return successResponse(
      res,
      "Addresses retrieved successfully.",
      addresses,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const getUserAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const role = req.user.role;

    const address = await AddressServices.getAddressById(id, userId, role);

    return successResponse(
      res,
      "Address retrieved successfully.",
      address,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const newAddress = await AddressServices.createAddress(
      userId,
      req.body
    );

    return successResponse(
      res,
      "Address created successfully.",
      newAddress,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const updatedAddress = await AddressServices.updateAddress(
      id,
      userId,
      req.body
    );

    return successResponse(
      res,
      "Address updated successfully.",
      updatedAddress,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const role = req.user.role;
    await AddressServices.deleteAddress(id, userId, role);

    return successResponse(
      res,
      "Address deleted successfully.",
      null,
      200
    );
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { address_id } = req.params;
    const userId = req.user.user_id;

    const slots = await AddressServices.getAvailableSlots(
      userId,
      address_id
    );

    return successResponse(
      res,
      "Available slots retrieved successfully.",
      slots,
      200
    );
  } catch (err) {
    next(err);
  }
};