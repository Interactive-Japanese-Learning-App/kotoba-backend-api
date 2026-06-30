"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const learningController_1 = require("../controllers/learningController");
const router = express_1.default.Router();
//
// GET ALL CATEGORIES
//
router.get("/categories", learningController_1.getLearningCategories);
//
// GET DETAIL BY TYPE
//
router.get("/:type", learningController_1.getLearningByType);
exports.default = router;
