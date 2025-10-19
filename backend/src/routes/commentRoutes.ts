import express from "express";
import { addComment, getTaskComments, editComment, deleteComment } from "../controllers/commentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:taskId", authMiddleware, addComment);
router.get("/:taskId", authMiddleware, getTaskComments);
router.put("/:commentId", authMiddleware, editComment);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
