import mongoose from "mongoose";
import { bigdataDB } from "../config/bigdataDB";

const channelSchema = new mongoose.Schema(
  {
    channel: String,
    subscribers: Number,
    total_views: Number,
    video_count: Number,
    score: Number,
    updated_at: Date,
  },
  {
    collection: "channels",
  }
);

export default bigdataDB.model("Channel", channelSchema);