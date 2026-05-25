// routes/accountRoutes.ts

import express from "express";

import {
  getAllAccounts,
  updateRole,
  deleteAccount,
} from "../controllers/accountController";

import {
  verifyToken,
} from "../middlewares/verifyToken";

import {
  verifyAdmin,
} from "../middlewares/verifyAdmin";

const router = express.Router();

//
// ==============================
// ACCOUNT MANAGEMENT
// ==============================
//

// Get all accounts
router.get(
  "/accounts",
  verifyToken,
  verifyAdmin,
  getAllAccounts
);

// Update role
router.patch(
  "/accounts/:id/role",
  verifyToken,
  verifyAdmin,
  updateRole
);

// Delete account
router.delete(
  "/accounts/:id",
  verifyToken,
  verifyAdmin,
  deleteAccount
);

export default router;