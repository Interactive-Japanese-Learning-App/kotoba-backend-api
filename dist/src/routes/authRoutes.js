"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyAdmin_1 = require("../middlewares/verifyAdmin");
const router = express_1.default.Router();
//
// ==============================
// AUTH ADMIN
// ==============================
//
// Register Admin
router.post("/admin/register", authController_1.registerAdmin);
// Login Admin
router.post("/admin/login", authController_1.loginAdmin);
//
// ==============================
// CRUD ADMIN
// ==============================
//
// Get All Admins
router.get("/admin", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, authController_1.getAdmins);
// Get Admin By ID
router.get("/admin/:id", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, authController_1.getAdminById);
// Update Admin (PUT)
router.put("/admin/:id", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, authController_1.updateAdmin);
// Patch Admin
router.patch("/admin/:id", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, authController_1.patchAdmin);
// Delete Admin
router.delete("/admin/:id", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, authController_1.deleteAdmin);
exports.default = router;
