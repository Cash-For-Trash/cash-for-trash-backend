import { Router } from "express";
import {
  createGarbageType,
  deleteGarbageType,
  getAllGarbageTypes,
  getGarbageType,
  updateGarbageType,
} from "../controllers/garbageType_controller.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { authenticate, validate } from "../middlewares/auth_middleware.js";
import upload from "../middlewares/upload_middleware.js";
import {
  createGarbageTypeValidation,
  updateGarbageTypeValidation,
} from "../validations/grabageType_validation.js"

import { ROLES } from "../utils/constants.js";

const router = Router();

/**
 * @openapi
 * /api/garbage-types:
 *   get:
 *     tags:
 *       - Garbage Types
 *     summary: Get all garbage types
 *     responses:
 *       200:
 *         description: Garbage types retrieved successfully.
 *       404:
 *         description: No garbage types found.
 */
router.get("/", getAllGarbageTypes);

/**
 * @openapi
 * /api/garbage-types:
 *   post:
 *     tags:
 *       - Garbage Types
 *     summary: Create a new garbage type
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - garbage_type_name
 *               - price_per_kg
 *             properties:
 *               garbage_type_name:
 *                 type: string
 *                 example: Plastic
 *               price_per_kg:
 *                 type: number
 *                 example: 10
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Garbage type created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 */
router.post(
  "/",
      authorize(ROLES.ADMIN),
     upload.single("image"),
  createGarbageTypeValidation,
  validate,
  createGarbageType
);

/**
 * @openapi
 * /api/garbage-types/{id}:
 *   get:
 *     tags:
 *       - Garbage Types
 *     summary: Get garbage type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cmcy2fxf0001abc123xyz
 *     responses:
 *       200:
 *         description: Garbage type retrieved successfully.
 *       404:
 *         description: Garbage type not found.
 */
router.get("/:id", getGarbageType);

/**
 * @openapi
 * /api/garbage-types/{id}:
 *   put:
 *     tags:
 *       - Garbage Types
 *     summary: Update garbage type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               garbage_type_name:
 *                 type: string
 *                 example: Plastic
 *               price_per_kg:
 *                 type: number
 *                 example: 15
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Garbage type updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Garbage type not found.
 */
router.put(
  "/:id",
//   authenticate,
//  authorize(ROLES.ADMIN),
 upload.single("image"),
  updateGarbageTypeValidation,
  validate,
  updateGarbageType
);

/**
 * @openapi
 * /api/garbage-types/{id}:
 *   delete:
 *     tags:
 *       - Garbage Types
 *     summary: Delete garbage type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Garbage type deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Garbage type not found.
 */
router.delete(
  "/:id",
  // authenticate,
  // authorize(ROLES.ADMIN),
  deleteGarbageType
);

export default router;