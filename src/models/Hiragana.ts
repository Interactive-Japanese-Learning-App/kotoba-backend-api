import mongoose from "mongoose";

const hiraganaSchema =
  new mongoose.Schema(
    {},
    {
      strict: false,
    }
  );

export default mongoose.model(
  "Hiragana",
  hiraganaSchema,
  "hiragana"
);