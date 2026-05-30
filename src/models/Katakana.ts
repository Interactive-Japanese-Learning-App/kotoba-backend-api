import mongoose from "mongoose";

const katakanaSchema =
  new mongoose.Schema(
    {},
    {
      strict: false,
    }
  );

export default mongoose.model(
  "Katakana",
  katakanaSchema,
  "katakana"
);