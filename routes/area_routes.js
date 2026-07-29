import { Router } from "express";
import {createArea,getAllAreas,getAreaById,updateArea,deleteArea,updateAreaPrice} from "../controllers/area_controller.js";
import {createAreaValidation,updateAreaValidation,getAreasValidation,areaIdValidation,updateAreaPriceValidation} from "../validations/area_validation.js";
import { validate, authenticate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";
import { ROLES } from "../utils/constants.js";
const router = Router();

/**
 * @openapi
 * /api/areas/createArea:
 *   post:
 *     tags:
 *       - Areas
 *     summary: Create a new service area
 *     description: Creates a new service area with its geographical boundaries.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAreaRequest'
 *     responses:
 *       201:
 *         description: Area created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaSuccessResponse'
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Area already exists.
 */
router.post("/createArea",authenticate,authorize("admin"),createAreaValidation,validate,createArea);
/**
 * @openapi
 * /api/areas/getAllAreas:
 *   get:
 *     tags:
 *       - Areas
 *     summary: Get all service areas
 *     description: Returns all available service areas.
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search by area name.
 *         example: Qena
 *     responses:
 *       200:
 *         description: Areas retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaListResponse'
 */
router.get("/getAllAreas",getAreasValidation,validate,getAllAreas);
/**
 * @openapi
 * /api/areas/getArea/{id}:
 *   get:
 *     tags:
 *       - Areas
 *     summary: Get area by ID
 *     description: Returns a single service area.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     responses:
 *       200:
 *         description: Area retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaSuccessResponse'
 *       404:
 *         description: Area not found.
 */
router.get("/getArea/:id",areaIdValidation,getAreaById);
/**
 * @openapi
 * /api/areas/updateArea/{id}:
 *   patch:
 *     tags:
 *       - Areas
 *     summary: Update an area
 *     description: Updates one or more fields of an existing service area.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAreaRequest'
 *     responses:
 *       200:
 *         description: Area updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreaSuccessResponse'
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Area not found.
 */
router.patch("/updateArea/:id",authenticate,authorize("admin"),updateAreaValidation,areaIdValidation,validate,updateArea);
/**
 * @openapi
 * /api/areas/deleteArea/{id}:
 *   delete:
 *     tags:
 *       - Areas
 *     summary: Delete an area
 *     description: Deletes an existing service area.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Area ID
 *     responses:
 *       200:
 *         description: Area deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Area not found.
 */
router.delete("/deleteArea/:id", authenticate, authorize("admin"),areaIdValidation,validate,deleteArea);
/**
 * @openapi
 * /api/areas/{id}/price:
 *   patch:
 *     tags:
 *       - Areas
 *     summary: Update area service price
 *     description: Update the service price for a specific area. Admin only.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: cms0x7nz90001v1y85ddoefwp
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_price
 *             properties:
 *               service_price:
 *                 type: number
 *                 example: 35
 *
 *     responses:
 *       200:
 *         description: Area price updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Area not found.
 */
router.patch("/:id/price",authenticate,authorize(ROLES.ADMIN),updateAreaPriceValidation,validate,updateAreaPrice);

export default router;