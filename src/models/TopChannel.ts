import mongoose from "mongoose";
import { bigdataDB } from "../config/bigdataDB";

const topChannelSchema = new mongoose.Schema(
  {
    channel_id: String,
    channel_name: String,

    thumbnail: String,
    channel_url: String,

    subscribers: Number,
    total_views: Number,
    total_videos: Number,

    score: Number,

    published_at: Date,
    updated_at: Date,
  },
  {
    collection: "top_channels",
  }
);

export default bigdataDB.model(
  "TopChannel",
  topChannelSchema
);