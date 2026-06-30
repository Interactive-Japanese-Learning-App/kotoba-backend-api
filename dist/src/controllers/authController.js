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
exports.deleteAdmin = exports.patchAdmin = exports.updateAdmin = exports.getAdminById = exports.getAdmins = exports.loginAdmin = exports.registerAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const validators_1 = require("../utils/validators");
//
// REGISTER ADMIN
//
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        //
        // VALIDATION
        //
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        //
        // EMAIL FORMAT
        //
        if (!validators_1.emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }
        //
        // PASSWORD FORMAT
        //
        if (!validators_1.passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain uppercase, lowercase, number, symbol and minimum 8 characters",
            });
        }
        //
        // CHECK EXISTING ADMIN
        //
        const existingAdmin = yield Admin_1.default.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists",
            });
        }
        //
        // HASH PASSWORD
        //
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        //
        // CREATE ADMIN
        //
        const admin = yield Admin_1.default.create({
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            success: true,
            message: "Register success",
            admin: {
                _id: admin._id,
                email: admin.email,
                createdAt: admin.createdAt,
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
exports.registerAdmin = registerAdmin;
//
// LOGIN ADMIN
//
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        //
        // VALIDATION
        //
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        //
        // FIND ADMIN
        //
        const admin = yield Admin_1.default.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        //
        // CHECK PASSWORD
        //
        const isMatch = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        //
        // GENERATE TOKEN
        //
        const token = jsonwebtoken_1.default.sign({
            id: admin._id,
            role: "admin",
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).json({
            success: true,
            message: "Login success",
            token,
            admin: {
                _id: admin._id,
                email: admin.email,
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
exports.loginAdmin = loginAdmin;
//
// GET ALL ADMINS
//
const getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield Admin_1.default.find()
            .select("-password");
        res.status(200).json({
            success: true,
            total: admins.length,
            admins,
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
exports.getAdmins = getAdmins;
//
// GET ADMIN BY ID
//
const getAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield Admin_1.default.findById(req.params.id).select("-password");
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        res.status(200).json({
            success: true,
            admin,
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
exports.getAdminById = getAdminById;
//
// UPDATE ADMIN (PUT)
//
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        const updatedData = {};
        //
        // UPDATE EMAIL
        //
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
        //
        // UPDATE PASSWORD
        //
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
        const admin = yield Admin_1.default.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
        }).select("-password");
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Admin updated",
            admin,
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
exports.updateAdmin = updateAdmin;
//
// PATCH ADMIN
//
const patchAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = req.body;
        //
        // EMAIL VALIDATION
        //
        if (updates.email) {
            if (!validators_1.emailRegex.test(updates.email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format",
                });
            }
        }
        //
        // PASSWORD VALIDATION
        //
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
        const admin = yield Admin_1.default.findByIdAndUpdate(req.params.id, updates, {
            new: true,
        }).select("-password");
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Admin patched",
            admin,
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
exports.patchAdmin = patchAdmin;
//
// DELETE ADMIN
//
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield Admin_1.default.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Admin deleted",
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
exports.deleteAdmin = deleteAdmin;
