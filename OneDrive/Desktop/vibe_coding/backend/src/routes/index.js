import { Router } from "express";
import userRoutes from "./userRoutes.js";
import projectRoutes from "./projectRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "task-management-api" });
});

router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
