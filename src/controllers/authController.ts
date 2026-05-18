import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin";

//
// ==============================
// REGISTER ADMIN
// ==============================
//

export const registerAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check existing admin
    const existingAdmin = await Admin.findOne({
      email,
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Register success",
      admin: {
        _id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
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
// ==============================
// LOGIN ADMIN
// ==============================
//

export const loginAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin
    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login success",
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
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
// ==============================
// GET ALL ADMINS
// ==============================
//

export const getAdmins = async (
  req: Request,
  res: Response
) => {
  try {

    const admins = await Admin.find()
      .select("-password");

    res.status(200).json({
      success: true,
      total: admins.length,
      admins,
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
// ==============================
// GET ADMIN BY ID
// ==============================
//

export const getAdminById = async (
  req: Request,
  res: Response
) => {
  try {

    const admin = await Admin.findById(
      req.params.id
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
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
// ==============================
// UPDATE ADMIN (PUT)
// ==============================
//

export const updateAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, password } = req.body;

    const updatedData: {
      email?: string;
      password?: string;
    } = {};

    // Update email if exists
    if (email) {
      updatedData.email = email;
    }

    // Update password if exists
    if (password) {

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      updatedData.password = hashedPassword;
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated",
      admin,
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
// ==============================
// PATCH ADMIN
// ==============================
//

export const patchAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const updates = req.body;

    // Hash password if updated
    if (updates.password) {

      const hashedPassword = await bcrypt.hash(
        updates.password,
        10
      );

      updates.password = hashedPassword;
    }

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
      }
    ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin patched successfully",
      admin,
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
// ==============================
// DELETE ADMIN
// ==============================
//

export const deleteAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const admin = await Admin.findByIdAndDelete(
      req.params.id
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};