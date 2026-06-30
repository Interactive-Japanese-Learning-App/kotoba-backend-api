import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../src/app";

dotenv.config();

let isConnected = false;

export default async function (
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGO_URI!);
      isConnected = true;
      console.log("MongoDB Connected");
    }

    return app(req as any, res as any);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}