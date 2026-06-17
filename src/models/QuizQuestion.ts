import mongoose, { Schema, Document } from "mongoose";

export interface IQuizQuestion extends Document {
  sectionId: mongoose.Types.ObjectId;
  questionNo: number;
  type: string;
  question: string;
  answer: string;
  hint: string;
  options: string[];
}

const QuizQuestionSchema =
  new Schema<IQuizQuestion>(
    {
      sectionId: {
        type: Schema.Types.ObjectId,
        ref: "QuizSection",
        required: true,
      },

      questionNo: {
        type: Number,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "multiple_choice",
          "puzzle",
          "writing",
          "speech",
        ],
        required: true,
      },

      question: {
        type: String,
        required: true,
      },

      hint: {
        type: String,
        default: "",
      },

      answer: {
        type: String,
        required: true,
      },

      options: {
        type: [String],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IQuizQuestion>(
  "QuizQuestion",
  QuizQuestionSchema
);