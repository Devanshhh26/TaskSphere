import { Request, Response } from "express";
import Board from "../models/Board";
import Project from "../models/Project";
import { AuthRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";

// Create a new board inside a project
export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) return res.status(400).json({ msg: "Board name is required" });

    const project = await Project.findOne({ _id: projectId, "members.userId": userId });
    if (!project) return res.status(403).json({ msg: "Not authorized or project not found" });

    const defaultColumns = [
      { id: "todo", title: "To Do", order: 1 },
      { id: "inprogress", title: "In Progress", order: 2 },
      { id: "done", title: "Done", order: 3 },
    ];

    const board = new Board({
      name,
      projectId: new mongoose.Types.ObjectId(projectId),
      columns: defaultColumns,
    });

    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

// Get all boards for a project
export const getProjectBoards = async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({ _id: projectId, "members.userId": userId });
    if (!project) return res.status(403).json({ msg: "Not authorized or project not found" });

    const boards = await Board.find({ projectId });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

// Update board columns (rename, reorder, etc.)
export const updateBoardColumns = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;
    const { columns } = req.body; // array of { id, title, order }

    if (!columns || !Array.isArray(columns))
      return res.status(400).json({ msg: "Columns array is required" });

    const userId = req.user.id;
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    const project = await Project.findOne({
      _id: board.projectId,
      "members.userId": userId,
    });
    if (!project) return res.status(403).json({ msg: "Not authorized" });

    board.columns = columns;
    await board.save();

    res.json({ msg: "Board columns updated", board });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

// Delete a board
export const deleteBoard = async (req: AuthRequest, res: Response) => {
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

    await Board.findByIdAndDelete(boardId);
    res.json({ msg: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};


