import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IUserQuizProgress
  extends Document {

  userId: string;

  sectionId:
  mongoose.Types.ObjectId;

  currentQuestion: number;

  sectionCompleted: boolean;
}

const UserQuizProgressSchema =
  new Schema(
    {
      userId: {
        type: String,
        required: true,
      },

      sectionId: {
        type: Schema.Types.ObjectId,
        ref: "QuizSection",
        required: true,
      },

      currentQuestion: {
        type: Number,
        default: 1,
      },

      sectionCompleted: {
        type: Boolean,
        default: false,
      },

      completedQuestions: {
        type: [Number],
        default: [],
      }
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "UserQuizProgress",
  UserQuizProgressSchema,
  "user_quiz_progress"
);