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
exports.getRoadmapProgress = exports.submitAnswer = exports.getProgress = exports.getQuestionsBySection = exports.getSections = void 0;
const QuizSection_1 = __importDefault(require("../models/QuizSection"));
const QuizQuestion_1 = __importDefault(require("../models/QuizQuestion"));
const UserQuizProgress_1 = __importDefault(require("../models/UserQuizProgress"));
const User_1 = __importDefault(require("../models/User"));
const activityLog_1 = __importDefault(require("../models/activityLog"));
const getSections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sections = yield QuizSection_1.default.find().sort({
            order: 1,
        });
        res.status(200).json({
            success: true,
            data: sections,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil section",
            error,
        });
    }
});
exports.getSections = getSections;
const getQuestionsBySection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sectionId } = req.params;
        const questions = yield QuizQuestion_1.default.find({
            sectionId,
        }).sort({
            questionNo: 1,
        });
        res.status(200).json({
            success: true,
            data: questions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil soal",
            error,
        });
    }
});
exports.getQuestionsBySection = getQuestionsBySection;
const getProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, sectionId } = req.query;
        let progress = yield UserQuizProgress_1.default.findOne({
            userId,
            sectionId,
        });
        if (!progress) {
            progress = yield UserQuizProgress_1.default.create({
                userId,
                sectionId,
                currentQuestion: 1,
                sectionCompleted: false,
                completedQuestions: [],
            });
        }
        res.status(200).json({
            success: true,
            data: progress,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
});
exports.getProgress = getProgress;
const submitAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, sectionId, questionNo, answer, } = req.body;
        const question = yield QuizQuestion_1.default.findOne({
            sectionId,
            questionNo,
        });
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Soal tidak ditemukan",
            });
        }
        const isCorrect = question.answer === answer;
        if (!isCorrect) {
            return res.status(200).json({
                success: true,
                correct: false,
            });
        }
        // =========================
        // AMBIL PROGRESS USER
        // =========================
        let progress = yield UserQuizProgress_1.default.findOne({
            userId,
            sectionId,
        });
        if (!progress) {
            progress = yield UserQuizProgress_1.default.create({
                userId,
                sectionId,
                currentQuestion: 1,
                sectionCompleted: false,
                completedQuestions: [],
            });
        }
        // =========================
        // SUDAH PERNAH DIKERJAKAN?
        // =========================
        const alreadyCompleted = progress.completedQuestions.includes(questionNo);
        if (!alreadyCompleted) {
            progress.completedQuestions.push(questionNo);
        }
        progress.currentQuestion = Math.max(progress.currentQuestion, questionNo + 1);
        if (progress.completedQuestions.length >= 5) {
            progress.sectionCompleted = true;
            progress.currentQuestion = 5;
        }
        yield progress.save();
        // =========================
        // TAMBAH XP USER
        // HANYA JIKA SOAL BARU
        // =========================
        if (!alreadyCompleted) {
            const user = yield User_1.default.findById(userId);
            if (user) {
                // maksimal 100 XP
                if (user.xp < 100) {
                    user.xp += 20;
                    if (user.xp > 100) {
                        user.xp = 100;
                    }
                    user.level = Math.floor(user.xp / 100) + 1;
                    yield user.save();
                }
            }
            // =========================
            // SIMPAN ACTIVITY LOG
            // =========================
            yield activityLog_1.default.create({
                userId,
                activityType: "quiz",
                title: "Mengerjakan Kuis",
                detail: `Berhasil menjawab soal nomor ${questionNo} - Pelafalan`,
                score: 20,
            });
        }
        return res.status(200).json({
            success: true,
            correct: true,
            nextQuestion: progress.currentQuestion,
            sectionCompleted: progress.sectionCompleted,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
        });
    }
});
exports.submitAnswer = submitAnswer;
const getRoadmapProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const sections = yield QuizSection_1.default.find().sort({
            order: 1,
        });
        const progress = yield UserQuizProgress_1.default.find({
            userId,
        });
        res.status(200).json({
            success: true,
            sections,
            progress,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
        });
    }
});
exports.getRoadmapProgress = getRoadmapProgress;
