import { Request, Response } from "express";
import mongoose from "mongoose";

//
// GET ALL CATEGORIES
//
export const getLearningCategories =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const db =
        mongoose.connection.db;

      // CHECK DB
      if (!db) {
        return res.status(500).json({
          success: false,
          message:
            "Database not connected",
        });
      }

      const collections =
        await db
          .listCollections()
          .toArray();

      const categories =
        collections
          .map((c) => c.name)
          .filter(
            (name) =>
              name !== "admins" &&
              name !== "users"
          );

      res.status(200).json({
        success: true,
        categories,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });

    }
  };

//
// GET LEARNING DETAIL
//
export const getLearningByType =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const db =
        mongoose.connection.db;

      if (!db) {
        return res.status(500).json({
          success: false,
          message:
            "Database not connected",
        });
      }

      // FIX
      const type = String(
        req.params.type
      );

      const data =
        await db
          .collection(type)
          .find({})
          .toArray();

      res.status(200).json({
        success: true,
        total: data.length,
        data,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });

    }
  };