import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createBoard, getProjectBoards,updateBoardColumns,deleteBoard } from "../controllers/boardController";

const router = express.Router();

router.post("/:id/boards", authMiddleware, createBoard);
router.get("/:id/boards", authMiddleware, getProjectBoards);
router.put("/boards/:boardId/columns", authMiddleware, updateBoardColumns);
router.delete("/boards/:boardId", authMiddleware, deleteBoard);


export default router;
