import { Request, Response } from "express";
import Video from "../models/Video";
import Channel from "../models/Channel";
import TopChannel from "../models/TopChannel";

export const getYoutubeData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const videos = await Video.find()
      .sort({ score: -1 })
      .limit(10);

    const channels = await Channel.find()
      .sort({ score: -1 })
      .limit(10);

    const topChannels = await TopChannel.find()
      .sort({ score: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      message: "Youtube data retrieved successfully",
      data: {
        videos,
        channels,
        topChannels
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve youtube data"
    });
  }
};