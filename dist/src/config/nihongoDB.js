"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nihongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.nihongoDB = mongoose_1.default.createConnection(process.env.MONGO_URI, {
    dbName: "kotoba",
});
exports.nihongoDB.on("connected", () => {
    console.log("✅ Nihongo DB Connected");
});
