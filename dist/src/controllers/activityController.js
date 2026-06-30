"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivities = exports.createActivity = void 0;
const activityLog_1 = __importDefault(require("../models/activityLog"));
const createActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("CREATE ACTIVITY");
        console.log(req.body);
        const activity = yield activityLog_1.default.create(req.body);
        return res.status(201).json({
            success: true,
            data: activity,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create activity",
            error,
        });
    }
});
exports.createActivity = createActivity;
const getActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const activities = yield activityLog_1.default.find({
            userId,
        }).sort({
            createdAt: -1,
        });
        return res.status(200).json({
            success: true,
            data: activities,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get activities",
            error,
        });
    }
});
exports.getActivities = getActivities;
