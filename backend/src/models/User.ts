import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "developer" | "viewer";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, requried: true },
    password: { type: String, requried: true },
    role: {
      type: String,
      enum: ["admin", "manager", "developer", "viewer"],
      default: "developer",
    },
  },
  { timestamps: true }
);
export default mongoose.model<IUser>("User", userSchema);
