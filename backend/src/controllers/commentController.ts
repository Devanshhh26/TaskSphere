import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import Comment from "../models/Comment";
import Task from "../models/Task";
import mongoose from "mongoose";


// Add a comment to a task

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const comment = await Comment.create({
      taskId,
      userId,
      content,
    });

    res.status(201).json({ msg: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

//Get all comments for a task

export const getTaskComments = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ taskId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

// Edit a comment

export const editComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ msg: "You can only edit your own comments" });
    }

    comment.content = content;
    await comment.save();

    res.json({ msg: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

// Delete a comment

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.userId.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ msg: "You can only delete your own comments unless you are an admin" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ msg: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};
