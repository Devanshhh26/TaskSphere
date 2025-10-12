import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  boardId: mongoose.Types.ObjectId;
  columnId: string; // it tells which column the task is currently in
  title: string;
  description?: string;
  status?: string; 
  assignees: mongoose.Types.ObjectId[];
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  dependencies: mongoose.Types.ObjectId[]; // other tasks this one depends on
  subtasks: {
    title: string;
    completed: boolean;
  }[];
  activity: {                               // to log the who did what
    userId: mongoose.Types.ObjectId;
    action: string;
    timestamp: Date;
  }[];
}

const TaskSchema = new Schema<ITask>(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    columnId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date },
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    subtasks: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    activity: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        action: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
