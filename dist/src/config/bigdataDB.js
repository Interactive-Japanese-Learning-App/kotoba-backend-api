"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigdataDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.bigdataDB = mongoose_1.default.createConnection(process.env.MONGO_URI, {
    dbName: "bigdata_youtube",
});
exports.bigdataDB.on("connected", () => {
    console.log("✅ BigData DB Connected");
});
