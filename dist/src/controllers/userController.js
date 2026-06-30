"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.deleteUser = exports.patchUser = exports.updateUser = exports.getProfile = exports.getUserById = exports.getUsers = exports.loginUser = exports.resendOtp = exports.resetPassword = exports.verifyResetOtp = exports.deleteOwnAccount = exports.forgotPassword = exports.registerUser = exports.googleLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const sendOtp_1 = require("../utils/sendOtp");
const google_auth_library_1 = require("google-auth-library");
const activityLog_1 = __importDefault(require("../models/activityLog"));
const validators_1 = require("../utils/validators");
// GOOGLE LOGIN
// Inisialisasi Google Client menggunakan Web Client ID dari Google Cloud Console
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);
//
// GOOGLE LOGIN / REGISTER
//
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: "ID Token is required",
            });
        }
        // 1. Verifikasi ID Token ke Google server
        const ticket = yield googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_WEB_CLIENT_ID, // Harus sama dengan client ID di backend
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({
                success: false,
                message: "Invalid Google token structure",
            });
        }
        const { email, picture, name } = payload;
        // 2. Cari user di database berdasarkan email Google
        let user = yield User_1.default.findOne({ email });
        let isNewUser = false;
        const highResPicture = picture
            ? picture.replace(/=s\d+-c$/, "=s400-c")
            : "";
        if (!user) {
            isNewUser = true;
            user = yield User_1.default.create({
                email,
                password: "GOOGLE_AUTH_ACCOUNT_NO_PASSWORD",
                isVerified: true,
                photoUrl: highResPicture
            });
        }
        if (highResPicture && user.photoUrl !== highResPicture) {
            user.photoUrl = highResPicture;
            yield user.save();
        }
        // 3. Generate JWT Token bawaan aplikasi kamu (menyamakan struktur login biasa)
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            role: "user",
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.status(200).json({
            success: true,
            token,
            isNewUser,
            user: {
                _id: user._id,
                email: user.email,
                photoUrl: user.photoUrl,
            },
        });
    }
    catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Google authentication failed",
        });
    }
});
exports.googleLogin = googleLogin;
//
// REGISTER USER
//
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        if (!email ||
            !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        if (!validators_1.emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }
        if (!validators_1.passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain uppercase, lowercase, number, symbol and minimum 8 characters",
            });
        }
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            // jika akun sudah terverifikasi
            if (existingUser.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }
            // jika akun belum verifikasi
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            existingUser.otpCode = otp;
            existingUser.otpExpiredAt = new Date(Date.now() + 1 * 60 * 1000);
            yield existingUser.save();
            yield (0, sendOtp_1.sendOtpEmail)(email, otp);
            return res.status(200).json({
                success: true,
                needVerify: true,
                message: "Akun belum diverifikasi. OTP baru telah dikirim.",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const user = yield User_1.default.create({
            email,
            password: hashedPassword,
            isVerified: false,
            otpCode: otp,
            otpExpiredAt: new Date(Date.now() + 1 * 60 * 1000),
        });
        try {
            yield (0, sendOtp_1.sendOtpEmail)(email, otp);
        }
        catch (e) {
            console.log("EMAIL ERROR:");
            console.log(e);
        }
        res.status(201).json({
            success: true,
            message: "OTP berhasil dibuat",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.registerUser = registerUser;
// FORGOT PASSWORD
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({
            email,
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpiredAt = new Date(Date.now() + 5 * 60 * 1000);
        yield user.save();
        yield (0, sendOtp_1.sendOtpEmail)(email, otp);
        return res.status(200).json({
            success: true,
            message: "OTP berhasil dikirim",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.forgotPassword = forgotPassword;
const deleteOwnAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Akun berhasil dihapus",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.deleteOwnAccount = deleteOwnAccount;
const verifyResetOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, } = req.body;
        const user = yield User_1.default.findOne({
            email,
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }
        if (user.otpCode !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP salah",
            });
        }
        if (!user.otpExpiredAt ||
            user.otpExpiredAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP kadaluarsa",
            });
        }
        return res.status(200).json({
            success: true,
            message: "OTP valid",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.verifyResetOtp = verifyResetOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password, } = req.body;
        const user = yield User_1.default.findOne({
            email,
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }
        if (user.otpCode !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP salah",
            });
        }
        if (!user.otpExpiredAt ||
            user.otpExpiredAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP kadaluarsa",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        user.otpCode = null;
        user.otpExpiredAt = null;
        yield user.save();
        yield activityLog_1.default.create({
            userId: user._id,
            activityType: "reset_password",
            title: "Reset Password",
            detail: `${user.email} berhasil mengubah password`,
        });
        return res.status(200).json({
            success: true,
            message: "Password berhasil diubah",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.resetPassword = resetPassword;
// RESEND OTP
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
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
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otpCode = otp;
        user.otpExpiredAt = new Date(Date.now() + 1 * 60 * 1000);
        yield user.save();
        yield (0, sendOtp_1.sendOtpEmail)(email, otp);
        return res.status(200).json({
            success: true,
            message: "OTP berhasil dikirim ulang",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.resendOtp = resendOtp;
//
// LOGIN USER
//
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        if (!email ||
            !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Silakan verifikasi email terlebih dahulu",
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            role: "user",
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                email: user.email,
                photoUrl: user.photoUrl,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.loginUser = loginUser;
//
// GET ALL USERS
//
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find()
            .select("-password");
        res.status(200).json({
            success: true,
            total: users.length,
            users,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.getUsers = getUsers;
//
// GET USER BY ID
//
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.getUserById = getUserById;
// GET PROFILE //
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id)
            .select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                photoUrl: user.photoUrl,
                xp: user.xp,
                level: user.level,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.getProfile = getProfile;
//
// UPDATE USER (PUT)
//
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        const updatedData = {};
        if (email) {
            if (!validators_1.emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format",
                });
            }
            updatedData.email =
                email;
        }
        if (password) {
            if (!validators_1.passwordRegex.test(password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must contain uppercase, lowercase, number, symbol and minimum 8 characters",
                });
            }
            updatedData.password =
                yield bcryptjs_1.default.hash(password, 10);
        }
        const user = yield User_1.default.findByIdAndUpdate(req.params.id, updatedData, {
            returnDocument: 'after',
        }).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User updated",
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.updateUser = updateUser;
//
// PATCH USER
//
const patchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = req.body;
        if (updates.email) {
            if (!validators_1.emailRegex.test(updates.email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format",
                });
            }
        }
        if (updates.password) {
            if (!validators_1.passwordRegex.test(updates.password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must contain uppercase, lowercase, number, symbol and minimum 8 characters",
                });
            }
            updates.password =
                yield bcryptjs_1.default.hash(updates.password, 10);
        }
        const user = yield User_1.default.findByIdAndUpdate(req.params.id, updates, {
            returnDocument: 'after',
        }).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User patched",
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.patchUser = patchUser;
//
// DELETE USER
//
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.deleteUser = deleteUser;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan",
            });
        }
        if (user.otpCode !== otp) {
            return res.status(400).json({
                success: false,
                message: "OTP salah",
            });
        }
        if (!user.otpExpiredAt ||
            user.otpExpiredAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP kadaluarsa",
            });
        }
        user.isVerified = true;
        user.otpCode = null;
        user.otpExpiredAt = null;
        yield user.save();
        yield activityLog_1.default.create({
            userId: user._id,
            activityType: "register",
            title: "Registrasi Akun",
            detail: `${user.email} berhasil membuat akun`,
        });
        res.status(200).json({
            success: true,
            message: "Email berhasil diverifikasi",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.verifyOtp = verifyOtp;
