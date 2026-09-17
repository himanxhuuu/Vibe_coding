import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as taskController from "../controllers/taskController.js";

const router = Router();

router.get("/", asyncHandler(taskController.listTasks));
router.get("/:id", asyncHandler(taskController.getTask));
router.post("/", asyncHandler(taskController.createTask));
router.put("/:id", asyncHandler(taskController.updateTask));
router.delete("/:id", asyncHandler(taskController.deleteTask));
router.patch("/:id/status", asyncHandler(taskController.updateTaskStatus));

export default router;
