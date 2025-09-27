import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createProject, getUserProjects, getProjectById } from "../controllers/projectController";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getUserProjects);
router.get("/:id", authMiddleware, getProjectById);

export default router;
