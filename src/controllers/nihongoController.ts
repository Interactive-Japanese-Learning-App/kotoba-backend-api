import { Request, Response } from "express";
import {
  HiraganaModel,
  KatakanaModel,
  NumberModel,
  DateModel,
  MonthModel,
  FamilyModel,
  AnimalModel,
  FoodModel,
  DrinkModel,
  JobModel,
  ObjectModel,
} from "../models/nihongoCollections";

const collections = {
  hiragana: HiraganaModel,
  katakana: KatakanaModel,
  numbers: NumberModel,
  dates: DateModel,
  months: MonthModel,
  family: FamilyModel,
  animals: AnimalModel,
  foods: FoodModel,
  drinks: DrinkModel,
  jobs: JobModel,
  object_vocab: ObjectModel,
};

export const getNihongoByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;

    const Model =
      collections[category as keyof typeof collections];

    if (!Model) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
      return;
    }

    const data = await Model.find().sort({ id: 1 });

    res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};