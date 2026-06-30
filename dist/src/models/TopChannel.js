"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bigdataDB_1 = require("../config/bigdataDB");
const topChannelSchema = new mongoose_1.default.Schema({
    channel_id: String,
    channel_name: String,
    subscribers: Number,
    total_views: Number,
    total_videos: Number,
    score: Number,
    updated_at: Date,
    published_at: Date,
}, {
    collection: "top_channels",
});
exports.default = bigdataDB_1.bigdataDB.model("TopChannel", topChannelSchema);
