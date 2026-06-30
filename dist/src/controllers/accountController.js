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
exports.deleteAccount = exports.updateRole = exports.getAllAccounts = void 0;
const User_1 = __importDefault(require("../models/User"));
const Admin_1 = __importDefault(require("../models/Admin"));
//
// ==============================
// GET ALL ACCOUNTS
// ==============================
//
const getAllAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ambil admin
        const admins = yield Admin_1.default.find()
            .select("-password");
        // format admin
        const formattedAdmins = admins.map((admin) => (Object.assign(Object.assign({}, admin.toObject()), { 
            // ambil name dari email
            name: admin.email.split("@")[0], role: "admin" })));
        // ambil user
        const users = yield User_1.default.find()
            .select("-password");
        // format user
        const formattedUsers = users.map((user) => (Object.assign(Object.assign({}, user.toObject()), { 
            // ambil name dari email
            name: user.email.split("@")[0], role: "user" })));
        // gabungkan
        const accounts = [
            ...formattedAdmins,
            ...formattedUsers,
        ];
        res.status(200).json({
            success: true,
            total: accounts.length,
            accounts,
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
exports.getAllAccounts = getAllAccounts;
//
// ==============================
// UPDATE ROLE
// ==============================
//
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.body;
        //
        // VALIDATION
        //
        if (role !== "admin" &&
            role !== "user") {
            return res.status(400).json({
                success: false,
                message: "Role must be admin or user",
            });
        }
        //
        // USER -> ADMIN
        //
        if (role === "admin") {
            // cari user + password
            const user = yield User_1.default.findById(req.params.id).select("+password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            // cek admin existing
            const existingAdmin = yield Admin_1.default.findOne({
                email: user.email,
            });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    message: "Already admin",
                });
            }
            // pindahkan ke admin
            yield Admin_1.default.create({
                email: user.email,
                password: user.password,
            });
            // hapus user lama
            yield User_1.default.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Role updated to admin",
            });
        }
        //
        // ADMIN -> USER
        //
        if (role === "user") {
            // cari admin + password
            const admin = yield Admin_1.default.findById(req.params.id).select("+password");
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found",
                });
            }
            // cek user existing
            const existingUser = yield User_1.default.findOne({
                email: admin.email,
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Already user",
                });
            }
            // pindahkan ke user
            yield User_1.default.create({
                email: admin.email,
                password: admin.password,
            });
            // hapus admin lama
            yield Admin_1.default.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Role updated to user",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.updateRole = updateRole;
//
// ==============================
// DELETE ACCOUNT
// ==============================
//
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // cek admin
        const admin = yield Admin_1.default.findById(req.params.id);
        if (admin) {
            yield Admin_1.default.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Admin deleted",
            });
        }
        // cek user
        const user = yield User_1.default.findById(req.params.id);
        if (user) {
            yield User_1.default.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                success: true,
                message: "User deleted",
            });
        }
        return res.status(404).json({
            success: false,
            message: "Account not found",
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
exports.deleteAccount = deleteAccount;
