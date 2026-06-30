import mongoose from "mongoose";
import { bigdataDB } from "../config/bigdataDB";

const videoSchema = new mongoose.Schema(
  {
    video_id: String,
    title: String,
    channel: String,

    thumbnail: String,
    video_url: String,

    published_at: Date,

    views: Number,
    likes: Number,
    comments: Number,

    score: Number,
    updated_at: Date,
  },
  {
    collection: "videos",
  }
);

export default bigdataDB.model(
  "Video",
  videoSchema
);