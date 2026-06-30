"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyAdmin_1 = require("../middlewares/verifyAdmin");
const userController_2 = require("../controllers/userController");
const router = express_1.default.Router();
//
// ==============================
// AUTH USER
// ==============================
//
// Register User
router.post("/user/register", userController_1.registerUser);
router.post("/verify-otp", userController_1.verifyOtp);
// Resend OTP
router.post("/resend-otp", userController_1.resendOtp);
// Login User
router.post("/user/login", userController_1.loginUser);
// Google Login
router.post("/user/google-login", userController_2.googleLogin);
//
// ==============================
// CRUD USER
// ==============================
//
// Get profile
router.get("/profile/:id", userController_1.getProfile);
// Get All Users
router.get("/user", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, userController_1.getUsers);
// Get User By ID
router.get("/user/:id", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, userController_1.getUserById);
// ==============================
// UPDATE PROFILE USER
// TANPA ADMIN (UNTUK MOBILE)
// ==============================
// Update User (PUT)
router.put("/user/:id", userController_1.updateUser);
// Patch User
router.patch("/user/:id", userController_1.patchUser);
//
// ==============================
// DELETE USER
// ==============================
//
// Delete User
router.delete("/user/:id", verifyToken_1.verifyToken, verifyAdmin_1.verifyAdmin, userController_1.deleteUser);
// Lupa password
router.post("/forgot-password", userController_1.forgotPassword);
router.post("/reset-password", userController_1.resetPassword);
router.post("/verify-reset-otp", userController_1.verifyResetOtp);
router.delete("/user/delete-account/:id", userController_1.deleteOwnAccount);
exports.default = router;
