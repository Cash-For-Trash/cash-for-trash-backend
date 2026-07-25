import { Router } from "express";
import {createArea,getAllAreas,getAreaById,updateArea,deleteArea} from "../controllers/area_controller.js";
import {createAreaValidation,updateAreaValidation,getAreasValidation,areaIdValidation} from "../validations/area_validation.js";
import { validate, authenticate } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/roles_middleware.js";

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

export default router;