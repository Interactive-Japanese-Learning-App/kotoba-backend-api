import { Request, Response } from "express";

import User from "../models/User";
import Admin from "../models/Admin";

//
// ==============================
// GET ALL ACCOUNTS
// ==============================
//
export const getAllAccounts = async (
  req: Request,
  res: Response
) => {
  try {

    // ambil admin
    const admins = await Admin.find()
      .select("-password");

    // format admin
    const formattedAdmins =
      admins.map((admin) => ({
        ...admin.toObject(),

        // ambil name dari email
        name:
          admin.email.split("@")[0],

        role: "admin",
      }));

    // ambil user
    const users = await User.find()
      .select("-password");

    // format user
    const formattedUsers =
      users.map((user) => ({
        ...user.toObject(),

        // ambil name dari email
        name:
          user.email.split("@")[0],

        role: "user",
      }));

    // gabungkan
    const accounts = [
      ...formattedAdmins,
      ...formattedUsers,
    ];

    res.status(200).json({
      success: true,
      total: accounts.length,
      accounts,
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
// UPDATE ROLE
// ==============================
//
export const updateRole = async (
  req: Request,
  res: Response
) => {
  try {

    const { role } = req.body;

    //
    // VALIDATION
    //
    if (
      role !== "admin" &&
      role !== "user"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be admin or user",
      });
    }

    //
    // USER -> ADMIN
    //
    if (role === "admin") {

      // cari user + password
      const user =
        await User.findById(
          req.params.id
        ).select("+password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      // cek admin existing
      const existingAdmin =
        await Admin.findOne({
          email: user.email,
        });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message:
            "Already admin",
        });
      }

      // pindahkan ke admin
      await Admin.create({
        email: user.email,
        password: user.password,
      });

      // hapus user lama
      await User.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Role updated to admin",
      });
    }

    //
    // ADMIN -> USER
    //
    if (role === "user") {

      // cari admin + password
      const admin =
        await Admin.findById(
          req.params.id
        ).select("+password");

      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Admin not found",
        });
      }

      // cek user existing
      const existingUser =
        await User.findOne({
          email: admin.email,
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "Already user",
        });
      }

      // pindahkan ke user
      await User.create({
        email: admin.email,
        password: admin.password,
      });

      // hapus admin lama
      await Admin.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Role updated to user",
      });
    }

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
// DELETE ACCOUNT
// ==============================
//
export const deleteAccount = async (
  req: Request,
  res: Response
) => {
  try {

    // cek admin
    const admin =
      await Admin.findById(
        req.params.id
      );

    if (admin) {

      await Admin.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Admin deleted",
      });
    }

    // cek user
    const user =
      await User.findById(
        req.params.id
      );

    if (user) {

      await User.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "User deleted",
      });
    }

    return res.status(404).json({
      success: false,
      message:
        "Account not found",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};