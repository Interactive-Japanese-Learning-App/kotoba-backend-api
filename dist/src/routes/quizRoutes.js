"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizController_1 = require("../controllers/quizController");
const router = express_1.default.Router();
router.get("/sections", quizController_1.getSections);
router.get("/sections/:sectionId/questions", quizController_1.getQuestionsBySection);
router.get("/progress", quizController_1.getProgress);
router.post("/submit", quizController_1.submitAnswer);
router.get("/roadmap", quizController_1.getRoadmapProgress);
exports.default = router;
