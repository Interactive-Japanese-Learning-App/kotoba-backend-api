import { Request, Response } from "express";
import ActivityLog from "../models/activityLog";

export const createActivity = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("CREATE ACTIVITY");
    console.log(req.body);

    const activity = await ActivityLog.create(req.body);

    return res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Gagal membuat aktivitas",
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

    const activities = await ActivityLog.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Gagal mendapatkan aktivitas",
      error,
    });
  }
};

export const getActivityStatistics = async (
  req: Request,
  res: Response
) => {
  try {
    const { date } = req.query;

    console.log("========== ACTIVITY STATISTICS ==========");
    console.log("Date:", date);

    let match: any = {
      activityType: {
        $in: [
          "learning",
          "object_detection",
          "kana_writing",
          "pronunciation",
          "quiz",
        ],
      },
    };

    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date as string);
      endDate.setHours(23, 59, 59, 999);

      console.log("Start:", startDate);
      console.log("End:", endDate);

      match.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const totalLogs = await ActivityLog.countDocuments();
    console.log("Total Activity Logs:", totalLogs);

    const statistics = await ActivityLog.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$activityType",
          total: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          activityType: "$_id",
          total: 1,
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
    ]);

    console.log("Statistics:", statistics);

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Gagal mendapatkan statistik aktivitas",
      error,
    });
  }
};