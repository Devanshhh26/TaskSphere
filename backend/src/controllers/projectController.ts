import { Request, Response } from "express";
import Project, { IProject } from "../models/Project";
import { AuthRequest } from "../middlewares/authMiddleware";
import mongoose from "mongoose";

// Create a new project
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ msg: "Project name is required" });

    const project = new Project({
      name,
      description,
      members: [
        { userId: new mongoose.Types.ObjectId(req.user.id), role: "admin" },
      ],
      inviteCode: Math.random().toString(36).substring(2, 8),
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

// Get all projects for the logged-in user
export const getUserProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ "members.userId": userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};

// Get project by ID
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({
      _id: id,
      "members.userId": userId,
    });
    if (!project) return res.status(404).json({ msg: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: (err as Error).message });
  }
};
