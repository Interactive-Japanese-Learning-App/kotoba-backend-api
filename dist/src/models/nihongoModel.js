"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NihongoSchema = new mongoose_1.Schema({
    id: Number,
    character: String,
    romaji: String,
    meaning: String,
    type: String,
}, {
    versionKey: false,
});
exports.default = NihongoSchema;
