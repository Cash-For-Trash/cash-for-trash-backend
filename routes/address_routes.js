import { Router } from "express";
import {
  getAllUserAddresses,
  getUserAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/address_controller.js";

import {
  createAddressValidation,
  updateAddressValidation,
} from "../validations/address_valiadtion.js";

import { authenticate, validate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";

const router = Router();

/**
 * @openapi
 * /api/addresses:
 *   get:
 *     tags:
 *       - Addresses
 *     summary: Get all addresses for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.CUSTOMER),
  getAllUserAddresses
);

/**
 * @openapi
 * /api/addresses:
 *   post:
 *     tags:
 *       - Addresses
 *     summary: Create a new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - building_num
 *               - location
 *               - latitude
 *               - longitude
 *             properties:
 *               building_num:
 *                 type: integer
 *                 example: 12
 *               floor:
 *                 type: string
 *                 example: "3"
 *               location:
 *                 type: string
 *                 example: Qena, Egypt
 *               latitude:
 *                 type: number
 *                 example: 26.1642
 *               longitude:
 *                 type: number
 *                 example: 32.7267
 *               additional_note:
 *                 type: string
 *                 example: Beside the pharmacy
 *     responses:
 *       201:
 *         description: Address created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */
router.post(
  "/",
  authenticate,
  createAddressValidation,
  validate,
  createAddress
);

/**
 * @openapi
 * /api/addresses/{id}:
 *   get:
 *     tags:
 *       - Addresses
 *     summary: Get address by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     responses:
 *       200:
 *         description: Address retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Address not found.
 */
router.get(
  "/:id",
  authenticate,
authorize(ROLES.ADMIN, ROLES.CUSTOMER),
  getUserAddress
);

/**
 * @openapi
 * /api/addresses/{id}:
 *   put:
 *     tags:
 *       - Addresses
 *     summary: Update an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               building_num:
 *                 type: integer
 *                 example: 15
 *               floor:
 *                 type: string
 *                 example: "5"
 *               location:
 *                 type: string
 *                 example: Luxor, Egypt
 *               latitude:
 *                 type: number
 *                 example: 25.6872
 *               longitude:
 *                 type: number
 *                 example: 32.6396
 *               additional_note:
 *                 type: string
 *                 example: Near the school
 *     responses:
 *       200:
 *         description: Address updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Address not found.
 */
router.put(
  "/:id",
  authenticate,
  updateAddressValidation,
  validate,
  updateAddress
);

/**
 * @openapi
 * /api/addresses/{id}:
 *   delete:
 *     tags:
 *       - Addresses
 *     summary: Delete an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmrkvmwr20000utr4aoa4fjeh
 *     responses:
 *       200:
 *         description: Address deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Address not found.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.CUSTOMER),
  deleteAddress
);

export default router;