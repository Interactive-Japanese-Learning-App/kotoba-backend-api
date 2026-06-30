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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNihongoByCategory = void 0;
const nihongoCollections_1 = require("../models/nihongoCollections");
const collections = {
    hiragana: nihongoCollections_1.HiraganaModel,
    katakana: nihongoCollections_1.KatakanaModel,
    numbers: nihongoCollections_1.NumberModel,
    dates: nihongoCollections_1.DateModel,
    months: nihongoCollections_1.MonthModel,
    family: nihongoCollections_1.FamilyModel,
    animals: nihongoCollections_1.AnimalModel,
    foods: nihongoCollections_1.FoodModel,
    drinks: nihongoCollections_1.DrinkModel,
    jobs: nihongoCollections_1.JobModel,
    object_vocab: nihongoCollections_1.ObjectModel,
};
const getNihongoByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const Model = collections[category];
        if (!Model) {
            res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan",
            });
            return;
        }
        const data = yield Model.find().sort({ id: 1 });
        res.status(200).json({
            success: true,
            total: data.length,
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getNihongoByCategory = getNihongoByCategory;
