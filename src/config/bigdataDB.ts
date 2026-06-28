import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const bigdataDB = mongoose.createConnection(
  process.env.MONGO_URI!,
  {
    dbName: "bigdata_youtube",
  }
);

bigdataDB.on("connected", () => {
  console.log("✅ BigData DB Connected");
});