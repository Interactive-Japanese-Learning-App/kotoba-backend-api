import { Router } from "express";

import {
  createActivity,
  getActivities,
} from "../controllers/activityController";

const router = Router();

router.post(
  "/activity-log",
  createActivity
);

router.get(
  "/activity-log/:userId",
  getActivities
);

export default router;