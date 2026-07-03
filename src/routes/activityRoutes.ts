import { Router } from "express";

import {
  createActivity,
  getActivities,
  getActivityStatistics,
} from "../controllers/activityController";

const router = Router();

router.post("/activity-log", createActivity);

router.get("/activity-log/:userId", getActivities);

router.get("/statistics", getActivityStatistics);

export default router;