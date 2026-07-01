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

const getModel = (category: string | string[]) => {
  if (Array.isArray(category)) {
    category = category[0];
  }

  return collections[category as keyof typeof collections];
};

// GET NIHONGO
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

// CREATE NIHONGO
export const createNihongo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;

    const Model = getModel(category);

    if (!Model) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
      return;
    }

    const lastData = await Model.findOne().sort({ id: -1 });

    const newId = lastData ? lastData.id + 1 : 1;

    const data = await Model.create({
      id: newId,
      character: req.body.character,
      romaji: req.body.romaji,
      meaning: req.body.meaning,
      type: req.body.type,
    });

    res.status(201).json({
      success: true,
      message: "Data berhasil ditambahkan",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE NIHONGO
export const updateNihongo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, id } = req.params;

    const Model = getModel(category);

    if (!Model) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
      return;
    }

    const data = await Model.findByIdAndUpdate(
      id,
      {
        character: req.body.character,
        romaji: req.body.romaji,
        meaning: req.body.meaning,
        type: req.body.type,
      },
      {
        new: true,
      }
    );

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Data berhasil diperbarui",
      data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE NIHONGO 
export const deleteNihongo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, id } = req.params;

    const Model = getModel(category);

    if (!Model) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan",
      });
      return;
    }

    const data = await Model.findByIdAndDelete(id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};