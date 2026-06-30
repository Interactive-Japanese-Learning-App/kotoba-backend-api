"use strict";
// routes/accountRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountController_1 = require("../controllers/accountController");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyAdmin_1 = require("../middlewares/verifyAdmin");
const router = express_1.default.Router();
//
// ==============================
// ACCOUNT MANAGEMENT
// ==============================
//
// Get all accounts
router.get("/accounts", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, accountController_1.getAllAccounts);
// Update role
router.patch("/accounts/:id/role", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, accountController_1.updateRole);
// Delete account
router.delete("/accounts/:id", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, accountController_1.deleteAccount);
exports.default = router;
