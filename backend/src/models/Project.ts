import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  members: {
    userId: mongoose.Types.ObjectId;
    role: "admin" | "manager" | "developer" | "viewer";
  }[];
  inviteCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    members: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: ["admin", "manager", "developer", "viewer"],
          default: "developer",
        },
      },
    ],
    inviteCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", projectSchema);
