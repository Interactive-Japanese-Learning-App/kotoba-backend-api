"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const youtubeController_1 = require("../controllers/youtubeController");
const router = (0, express_1.Router)();
router.get("/", youtubeController_1.getYoutubeData);
exports.default = router;
