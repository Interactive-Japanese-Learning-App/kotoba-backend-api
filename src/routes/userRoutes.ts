import express from "express";

import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
  verifyOtp,
  resendOtp,
  resetPassword,
  verifyResetOtp,
  forgotPassword,
} from "../controllers/userController";

import {
  verifyToken,
} from "../middlewares/verifyToken";

import {
  verifyAdmin,
} from "../middlewares/verifyAdmin";

const router = express.Router();

//
// ==============================
// AUTH USER
// ==============================
//

// Register User
router.post(
  "/user/register",
  registerUser
);
router.post(
  "/verify-otp",
  verifyOtp
);

// Resend OTP
router.post(
  "/resend-otp",
  resendOtp
);

// Login User
router.post(
  "/user/login",
  loginUser
);

//
// ==============================
// CRUD USER
// ==============================
//

// Get All Users
router.get(
  "/user",
  verifyToken,
  verifyAdmin,
  getUsers
);

// Get User By ID
router.get(
  "/user/:id",
  verifyToken,
  verifyAdmin,
  getUserById
);

// ==============================
// UPDATE PROFILE USER
// TANPA ADMIN (UNTUK MOBILE)
// ==============================

// Update User (PUT)
router.put(
  "/user/:id",
  updateUser
);

// Patch User
router.patch(
  "/user/:id",
  patchUser
);

//
// ==============================
// DELETE USER
// ==============================
//

// Delete User
router.delete(
  "/user/:id",
  verifyToken,
  verifyAdmin,
  deleteUser
);

// Lupa password
router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

router.post(
  "/verify-reset-otp",
  verifyResetOtp
);

export default router;