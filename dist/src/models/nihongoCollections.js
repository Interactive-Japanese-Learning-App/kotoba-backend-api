"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectModel = exports.JobModel = exports.DrinkModel = exports.FoodModel = exports.AnimalModel = exports.FamilyModel = exports.MonthModel = exports.DateModel = exports.NumberModel = exports.KatakanaModel = exports.HiraganaModel = void 0;
const nihongoDB_1 = require("../config/nihongoDB");
const nihongoModel_1 = __importDefault(require("./nihongoModel"));
exports.HiraganaModel = nihongoDB_1.nihongoDB.model("Hiragana", nihongoModel_1.default, "hiragana");
exports.KatakanaModel = nihongoDB_1.nihongoDB.model("Katakana", nihongoModel_1.default, "katakana");
exports.NumberModel = nihongoDB_1.nihongoDB.model("Number", nihongoModel_1.default, "numbers");
exports.DateModel = nihongoDB_1.nihongoDB.model("Date", nihongoModel_1.default, "dates");
exports.MonthModel = nihongoDB_1.nihongoDB.model("Month", nihongoModel_1.default, "months");
exports.FamilyModel = nihongoDB_1.nihongoDB.model("Family", nihongoModel_1.default, "family");
exports.AnimalModel = nihongoDB_1.nihongoDB.model("Animal", nihongoModel_1.default, "animals");
exports.FoodModel = nihongoDB_1.nihongoDB.model("Food", nihongoModel_1.default, "foods");
exports.DrinkModel = nihongoDB_1.nihongoDB.model("Drink", nihongoModel_1.default, "drinks");
exports.JobModel = nihongoDB_1.nihongoDB.model("Job", nihongoModel_1.default, "jobs");
exports.ObjectModel = nihongoDB_1.nihongoDB.model("Object", nihongoModel_1.default, "object_vocab");
