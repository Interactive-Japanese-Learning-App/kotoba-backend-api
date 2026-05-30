import mongoose from "mongoose";

const foodSchema =
  new mongoose.Schema(
    {},
    {
      strict: false,
    }
  );

export default mongoose.model(
  "Animal",
  foodSchema,
  "animals"
);