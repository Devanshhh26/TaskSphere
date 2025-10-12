import { Request, Response } from "express";
import Task from "../models/Task";
import Board from "../models/Board";
import Project from "../models/Project";
import { AuthRequest } from "../middlewares/authMiddleware";

import mongoose from "mongoose";

// Create a new task in a specific board

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;
    const { title, description, columnId, assignees, priority, dueDate } = req.body;
    const userId = req.user.id;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    const project = await Project.findOne({
      _id: board.projectId,
      "members.userId": userId,
    });
    if (!project) return res.status(403).json({ msg: "Not authorized" });

    const task = await Task.create({
      boardId,
      columnId,
      title,
      description,
      assignees,
      priority,
      dueDate,
    });

    res.status(201).json({ msg: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};


// Get all tasks for a specific board

export const getBoardTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;
    const userId = req.user.id;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    const project = await Project.findOne({
      _id: board.projectId,
      "members.userId": userId,
    });
    if (!project) return res.status(403).json({ msg: "Not authorized" });

    const tasks = await Task.find({ boardId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

// Update a task

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const board = await Board.findById(task.boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    const project = await Project.findOne({
      _id: board.projectId,
      "members.userId": userId,
    });
    if (!project) return res.status(403).json({ msg: "Not authorized" });

    Object.assign(task, updates);
    await task.save();

    res.json({ msg: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};


// Delete a task

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const board = await Board.findById(task.boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    const project = await Project.findOne({
      _id: board.projectId,
      "members.userId": userId,
    });
    if (!project) return res.status(403).json({ msg: "Not authorized" });

    await Task.findByIdAndDelete(id);
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};


// Move a task between columns

export const moveTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; 
    const { newColumnId } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const board = await Board.findById(task.boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    const project = await Project.findOne({
      _id: board.projectId,
      "members.userId": userId,
    });
    if (!project) return res.status(403).json({ msg: "Not authorized" });

    const columnExists = board.columns.some(col => col.id === newColumnId);
    if (!columnExists) return res.status(400).json({ msg: "Invalid column ID" });

    task.columnId = newColumnId;
    await task.save();

    res.json({
      msg: "Task moved successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};
