import express from "express";

import {
  getLearningCategories,
  getLearningByType,
} from "../controllers/learningController";

const router = express.Router();

//
// GET ALL CATEGORIES
//
router.get(
  "/categories",
  getLearningCategories
);

//
// GET DETAIL BY TYPE
//
router.get(
  "/:type",
  getLearningByType
);

export default router;