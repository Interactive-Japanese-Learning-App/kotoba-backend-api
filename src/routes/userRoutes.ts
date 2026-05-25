import express from "express";

import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
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

// Update User (PUT)
router.put(
  "/user/:id",
  verifyToken,
  verifyAdmin,
  updateUser
);

// Patch User
router.patch(
  "/user/:id",
  verifyToken,
  verifyAdmin,
  patchUser
);

// Delete User
router.delete(
  "/user/:id",
  verifyToken,
  verifyAdmin,
  deleteUser
);

export default router;