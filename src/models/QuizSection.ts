import mongoose, { Schema, Document } from "mongoose";

export interface IQuizSection extends Document {
  title: string;
  description: string;
  order: number;
  color: string;
  isActive: boolean;
}

const QuizSectionSchema = new Schema<IQuizSection>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: "#C1121F",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IQuizSection>(
  "QuizSection",
  QuizSectionSchema
);