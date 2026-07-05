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
          "Role harus berupa admin atau pengguna.",
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
            "Pengguna tidak ditemukan",
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
            "Sudah menjadi admin",
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
          "Role diperbarui menjadi admin",
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
            "Admin tidak ditemukan",
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
            "Sudah menjadi pengguna",
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
          "Role diperbarui menjadi pengguna",
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
          "Admin dihapus",
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
          "Pengguna dihapus",
      });
    }

    return res.status(404).json({
      success: false,
      message:
        "Akun tidak ditemukan",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

export const getUserGrowth = async (
  req: Request,
  res: Response
) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Tanggal wajib diisi",
      });
    }

    const selectedDate = new Date(date as string);

    // Cari hari Senin
    const start = new Date(selectedDate);

    const day = start.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    // Hari Minggu
    const end = new Date(start);

    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    const users = await User.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const result = [
      { name: "Sen", Pendaftar: 0 },
      { name: "Sel", Pendaftar: 0 },
      { name: "Rab", Pendaftar: 0 },
      { name: "Kam", Pendaftar: 0 },
      { name: "Jum", Pendaftar: 0 },
      { name: "Sab", Pendaftar: 0 },
      { name: "Min", Pendaftar: 0 },
    ];

    users.forEach((user) => {
      const day = user.createdAt.getDay();

      const index = day === 0 ? 6 : day - 1;

      result[index].Pendaftar++;
    });

    return res.status(200).json({
      success: true,
      data: result,
      week: {
        start,
        end,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};