import express from "express";

import {
  getSections,
  getQuestionsBySection,
  getProgress,
  submitAnswer,
  getRoadmapProgress,
}
  from "../controllers/quizController";

const router = express.Router();

router.get(
  "/sections",
  getSections
);

router.get(
  "/sections/:sectionId/questions",
  getQuestionsBySection
);

router.get(
  "/progress",
  getProgress
);

router.post(
  "/submit",
  submitAnswer
);

router.get(
  "/roadmap",
  getRoadmapProgress
);

export default router;