"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nihongoController_1 = require("../controllers/nihongoController");
const router = (0, express_1.Router)();
router.get("/:category", nihongoController_1.getNihongoByCategory);
exports.default = router;
