import express from "express";
import {
  createTask, getBoardTasks, updateTask, deleteTask, moveTask } from "../controllers/taskController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/boards/:boardId/tasks", authMiddleware, createTask);

router.get("/boards/:boardId/tasks", authMiddleware, getBoardTasks);

router.put("/tasks/:id", authMiddleware, updateTask);

router.delete("/tasks/:id", authMiddleware, deleteTask);

router.patch("/tasks/:id/move", authMiddleware, moveTask);

export default router;
