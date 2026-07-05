import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const nihongoDB = mongoose.createConnection(
  process.env.MONGO_URI!,
  {
    dbName: "test",
  }
);

nihongoDB.on("connected", () => {
  console.log(
    "Nihongo DB:",
    nihongoDB.db?.databaseName
  );
});