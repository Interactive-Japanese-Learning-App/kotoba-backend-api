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
exports.getLearningByType = exports.getLearningCategories = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//
// GET ALL CATEGORIES
//
const getLearningCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = mongoose_1.default.connection.db;
        // CHECK DB
        if (!db) {
            return res.status(500).json({
                success: false,
                message: "Database not connected",
            });
        }
        const collections = yield db
            .listCollections()
            .toArray();
        const categories = collections
            .map((c) => c.name)
            .filter((name) => name !== "admins" &&
            name !== "users");
        res.status(200).json({
            success: true,
            categories,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.getLearningCategories = getLearningCategories;
//
// GET LEARNING DETAIL
//
const getLearningByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = mongoose_1.default.connection.db;
        if (!db) {
            return res.status(500).json({
                success: false,
                message: "Database not connected",
            });
        }
        // FIX
        const type = String(req.params.type);
        const data = yield db
            .collection(type)
            .find({})
            .toArray();
        res.status(200).json({
            success: true,
            total: data.length,
            data,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.getLearningByType = getLearningByType;
