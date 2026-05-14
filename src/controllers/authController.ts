import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import Admin from "../models/Admin";

export const registerAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Register success",
      admin,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }
};