import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import * as projectController from "../controllers/projectController.js";

const router = Router();

router.get("/", asyncHandler(projectController.listProjects));
router.get("/:id", asyncHandler(projectController.getProject));
router.post("/", asyncHandler(projectController.createProject));
router.put("/:id", asyncHandler(projectController.updateProject));
router.delete("/:id", asyncHandler(projectController.deleteProject));
router.get("/:id/members", asyncHandler(projectController.listMembers));
router.post("/:id/members", asyncHandler(projectController.addMember));
router.delete("/:id/members/:userId", asyncHandler(projectController.removeMember));

export default router;
