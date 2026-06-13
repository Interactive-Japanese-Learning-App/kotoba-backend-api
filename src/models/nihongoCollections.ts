import { nihongoDB } from "../config/nihongoDB";
import NihongoSchema from "./nihongoModel";

export const HiraganaModel =
  nihongoDB.model(
    "Hiragana",
    NihongoSchema,
    "hiragana"
  );

export const KatakanaModel =
  nihongoDB.model(
    "Katakana",
    NihongoSchema,
    "katakana"
  );

export const NumberModel =
  nihongoDB.model(
    "Number",
    NihongoSchema,
    "numbers"
  );

export const DateModel =
  nihongoDB.model(
    "Date",
    NihongoSchema,
    "dates"
  );

export const MonthModel =
  nihongoDB.model(
    "Month",
    NihongoSchema,
    "months"
  );

export const FamilyModel =
  nihongoDB.model(
    "Family",
    NihongoSchema,
    "family"
  );

export const AnimalModel =
  nihongoDB.model(
    "Animal",
    NihongoSchema,
    "animals"
  );

export const FoodModel =
  nihongoDB.model(
    "Food",
    NihongoSchema,
    "foods"
  );

export const DrinkModel =
  nihongoDB.model(
    "Drink",
    NihongoSchema,
    "drinks"
  );

export const JobModel =
  nihongoDB.model(
    "Job",
    NihongoSchema,
    "jobs"
  );

export const ObjectModel =
  nihongoDB.model(
    "Object",
    NihongoSchema,
    "object_vocab"
  );