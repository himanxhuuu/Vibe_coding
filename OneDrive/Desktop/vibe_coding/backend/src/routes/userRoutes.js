import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/workload", asyncHandler(userController.workloads));
router.get("/", asyncHandler(userController.listUsers));
router.get("/:id", asyncHandler(userController.getUser));
router.post("/", asyncHandler(userController.createUser));
router.put("/:id", asyncHandler(userController.updateUser));
router.delete("/:id", asyncHandler(userController.deleteUser));

export default router;
