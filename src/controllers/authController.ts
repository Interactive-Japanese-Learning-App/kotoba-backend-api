import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin";

import {
  emailRegex,
  passwordRegex,
} from "../utils/validators";

//
// REGISTER ADMIN
//
export const registerAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    //
    // VALIDATION
    //
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email dan kata sandi wajib diisi",
      });
    }

    //
    // EMAIL FORMAT
    //
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Format email tidak valid",
      });
    }

    //
    // PASSWORD FORMAT
    //
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Kata sandi harus memuat huruf besar, huruf kecil, angka, simbol, dan minimal 8 karakter",
      });
    }

    //
    // CHECK EXISTING ADMIN
    //
    const existingAdmin =
      await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "Admin sudah ada",
      });
    }

    //
    // HASH PASSWORD
    //
    const hashedPassword =
      await bcrypt.hash(password, 10);

    //
    // CREATE ADMIN
    //
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message:
        "Pendaftaran berhasil",
      admin: {
        _id: admin._id,
        email: admin.email,
        createdAt:
          admin.createdAt,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });

  }
};

//
// LOGIN ADMIN
//
export const loginAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    //
    // VALIDATION
    //
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email dan kata sandi wajib diisi",
      });
    }

    //
    // FIND ADMIN
    //
    const admin =
      await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin tidak ditemukan",
      });
    }

    //
    // CHECK PASSWORD
    //
    const isMatch =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Kredensial tidak valid",
      });
    }

    //
    // GENERATE TOKEN
    //
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Berhasil masuk",
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });

  }
};

//
// GET ALL ADMINS
//
export const getAdmins = async (
  req: Request,
  res: Response
) => {
  try {

    const admins =
      await Admin.find()
        .select("-password");

    res.status(200).json({
      success: true,
      total:
        admins.length,
      admins,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });

  }
};

//
// GET ADMIN BY ID
//
export const getAdminById = async (
  req: Request,
  res: Response
) => {
  try {

    const admin =
      await Admin.findById(
        req.params.id
      ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin not found",
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
      message:
        "Server error",
    });

  }
};

//
// UPDATE ADMIN (PUT)
//
export const updateAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const updatedData: any = {};

    //
    // UPDATE EMAIL
    //
    if (email) {

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message:
            "Format email tidak valid",
        });
      }

      updatedData.email =
        email;
    }

    //
    // UPDATE PASSWORD
    //
    if (password) {

      if (
        !passwordRegex.test(
          password
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Kata sandi harus memuat huruf besar, huruf kecil, angka, simbol, dan minimal 8 karakter.",
        });
      }

      updatedData.password =
        await bcrypt.hash(
          password,
          10
        );
    }

    const admin =
      await Admin.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
        }
      ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Admin telah memperbarui",
      admin,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });

  }
};

//
// PATCH ADMIN
//
export const patchAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const updates =
      req.body;

    //
    // EMAIL VALIDATION
    //
    if (updates.email) {

      if (
        !emailRegex.test(
          updates.email
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Format email tidak valid",
        });
      }
    }

    //
    // PASSWORD VALIDATION
    //
    if (updates.password) {

      if (
        !passwordRegex.test(
          updates.password
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Kata sandi harus memuat huruf besar, huruf kecil, angka, simbol, dan minimal 8 karakter.",
        });
      }

      updates.password =
        await bcrypt.hash(
          updates.password,
          10
        );
    }

    const admin =
      await Admin.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
        }
      ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Admin telah melakukan perbaikan",
      admin,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });

  }
};

//
// DELETE ADMIN
//
export const deleteAdmin = async (
  req: Request,
  res: Response
) => {
  try {

    const admin =
      await Admin.findByIdAndDelete(
        req.params.id
      );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Admin telah dihapus",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });

  }
};