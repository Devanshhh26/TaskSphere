import mongoose, { Document, Schema } from "mongoose";

export interface IColumn {
  id: string;          
  title: string;       
  order: number;     
}

export interface IBoard extends Document {
  name: string;
  projectId: mongoose.Types.ObjectId;
  columns: IColumn[];
  createdAt: Date;
  updatedAt: Date;
}

const columnSchema = new Schema<IColumn>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const boardSchema = new Schema<IBoard>(
  {
    name: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    columns: { type: [columnSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IBoard>("Board", boardSchema);
