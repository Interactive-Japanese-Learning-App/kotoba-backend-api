import { Request, Response } from "express";
import ActivityLog from "../models/activityLog";

export const createActivity = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("CREATE ACTIVITY");
    console.log(req.body);

    const activity =
      await ActivityLog.create(req.body);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create activity",
      error,
    });
  }
};

export const getActivities = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const activities =
      await ActivityLog.find({
        userId,
      }).sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get activities",
      error,
    });
  }
};
