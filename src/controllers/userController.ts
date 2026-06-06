import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import { sendOtpEmail } from "../utils/sendOtp";

import {
  emailRegex,
  passwordRegex,
} from "../utils/validators";

//
// REGISTER USER
//
export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email format",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number, symbol and minimum 8 characters",
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      // jika akun sudah terverifikasi
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // jika akun belum verifikasi
      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      existingUser.otpCode = otp;

      existingUser.otpExpiredAt = new Date(
        Date.now() + 1 * 60 * 1000
      );

      await existingUser.save();

      await sendOtpEmail(
        email,
        otp
      );

      return res.status(200).json({
        success: true,
        needVerify: true,
        message:
          "Akun belum diverifikasi. OTP baru telah dikirim.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString();

    const user = await User.create({
      email,
      password: hashedPassword,
      isVerified: false,
      otpCode: otp,
      otpExpiredAt: new Date(
        Date.now() + 1 * 60 * 1000
      ),
    });

    try {
      await sendOtpEmail(
        email,
        otp
      );
    } catch (e) {
      console.log("EMAIL ERROR:");
      console.log(e);
    }

    res.status(201).json({
      success: true,
      message: "OTP berhasil dibuat",
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

// RESEND OTP
export const resendOtp = async (
  req: Request,
  res: Response
) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terverifikasi",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otpCode = otp;

    user.otpExpiredAt = new Date(
      Date.now() + 1 * 60 * 1000
    );

    await user.save();

    await sendOtpEmail(
      email,
      otp
    );

    return res.status(200).json({
      success: true,
      message: "OTP berhasil dikirim ulang",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};

//
// LOGIN USER
//
export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Silakan verifikasi email terlebih dahulu",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
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
// GET ALL USERS
//
export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {

    const users =
      await User.find()
        .select("-password");

    res.status(200).json({
      success: true,
      total:
        users.length,
      users,
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
// GET USER BY ID
//
export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {

    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
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
// UPDATE USER (PUT)
//
export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const updatedData: any = {};

    if (email) {

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid email format",
        });
      }

      updatedData.email =
        email;
    }

    if (password) {

      if (
        !passwordRegex.test(
          password
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain uppercase, lowercase, number, symbol and minimum 8 characters",
        });
      }

      updatedData.password =
        await bcrypt.hash(
          password,
          10
        );
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "User updated",
      user,
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
// PATCH USER
//
export const patchUser = async (
  req: Request,
  res: Response
) => {
  try {

    const updates =
      req.body;

    if (updates.email) {

      if (
        !emailRegex.test(
          updates.email
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid email format",
        });
      }
    }

    if (updates.password) {

      if (
        !passwordRegex.test(
          updates.password
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain uppercase, lowercase, number, symbol and minimum 8 characters",
        });
      }

      updates.password =
        await bcrypt.hash(
          updates.password,
          10
        );
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "User patched",
      user,
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
// DELETE USER
//
export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {

    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "User deleted",
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

export const verifyOtp = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      email,
      otp,
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User tidak ditemukan",
      });
    }

    if (user.otpCode !== otp) {
      return res.status(400).json({
        success: false,
        message:
          "OTP salah",
      });
    }

    if (
      !user.otpExpiredAt ||
      user.otpExpiredAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP kadaluarsa",
      });
    }

    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiredAt = null;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Email berhasil diverifikasi",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });

  }
};
