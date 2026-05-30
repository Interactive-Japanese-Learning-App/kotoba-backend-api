import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ILearning
  extends Document {

  id: number;

  character?: string;

  hiragana?: string;

  romaji?: string;

  meaning?: string;

  type: string;

  number?: number;

  month?: number;

  date?: number;
}

const LearningSchema =
  new Schema(
    {
      id: {
        type: Number,
        required: true,
      },

      character: {
        type: String,
      },

      hiragana: {
        type: String,
      },

      romaji: {
        type: String,
      },

      meaning: {
        type: String,
      },

      type: {
        type: String,
        required: true,
      },

      number: {
        type: Number,
      },

      month: {
        type: Number,
      },

      date: {
        type: Number,
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Learning ||
  mongoose.model<ILearning>(
    "Learning",
    LearningSchema
  );