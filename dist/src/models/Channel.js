"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bigdataDB_1 = require("../config/bigdataDB");
const channelSchema = new mongoose_1.default.Schema({
    channel: String,
    subscribers: Number,
    total_views: Number,
    video_count: Number,
    score: Number,
    updated_at: Date,
}, {
    collection: "channels",
});
exports.default = bigdataDB_1.bigdataDB.model("Channel", channelSchema);
