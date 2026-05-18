import express from "express";

import {
  registerAdmin,
  loginAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  patchAdmin,
  deleteAdmin,
} from "../controllers/authController";

const router = express.Router();

//
// ==============================
// AUTH ADMIN
// ==============================
//

// Register Admin
router.post("/admin/register", registerAdmin);

// Login Admin
router.post("/admin/login", loginAdmin);

//
// ==============================
// CRUD ADMIN
// ==============================
//

// Get All Admins
router.get("/admin", getAdmins);

// Get Admin By ID
router.get("/admin/:id", getAdminById);

// Update Admin (all)
router.put("/admin/:id", updateAdmin);

// Update Admin (sebagian)
router.patch("/admin/:id", patchAdmin);

// Delete Admin
router.delete("/admin/:id", deleteAdmin);

export default router;