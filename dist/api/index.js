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
exports.default = default_1;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../src/app"));
dotenv_1.default.config();
let isConnected = false;
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!isConnected) {
                yield mongoose_1.default.connect(process.env.MONGO_URI);
                isConnected = true;
                console.log("MongoDB Connected");
            }
            (0, app_1.default)(req, res);
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: "Server Error",
            });
        }
    });
}
