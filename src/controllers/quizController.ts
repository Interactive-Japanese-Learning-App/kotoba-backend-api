import QuizSection from "../models/QuizSection";
import QuizQuestion from "../models/QuizQuestion";
import UserQuizProgress from "../models/UserQuizProgress";
import User from "../models/User";
import ActivityLog from "../models/activityLog";

export const getSections = async (req: any, res: any) => {
    try {
        const sections = await QuizSection.find().sort({
            order: 1,
        });

        res.status(200).json({
            success: true,
            data: sections,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil section",
            error,
        });
    }
};

export const getQuestionsBySection = async (
    req: any,
    res: any
) => {
    try {
        const { sectionId } = req.params;

        const questions = await QuizQuestion.find({
            sectionId,
        }).sort({
            questionNo: 1,
        });

        res.status(200).json({
            success: true,
            data: questions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal mengambil soal",
            error,
        });
    }
};

export const getProgress = async (
    req: any,
    res: any
) => {
    try {
        const { userId, sectionId } = req.query;

        let progress = await UserQuizProgress.findOne({
            userId,
            sectionId,
        });

        if (!progress) {
            progress = await UserQuizProgress.create({
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
    } catch (error) {
        res.status(500).json({
            success: false,
            error,
        });
    }
};

export const submitAnswer = async (
    req: any,
    res: any
) => {
    try {
        const {
            userId,
            sectionId,
            questionNo,
            answer,
        } = req.body;

        const question = await QuizQuestion.findOne({
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
        let progress = await UserQuizProgress.findOne({
            userId,
            sectionId,
        });

        if (!progress) {
            progress = await UserQuizProgress.create({
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
        const alreadyCompleted =
            progress.completedQuestions.includes(questionNo);

        if (!alreadyCompleted) {
            progress.completedQuestions.push(questionNo);
        }

        progress.currentQuestion = Math.max(
            progress.currentQuestion,
            questionNo + 1
        );

        if (progress.completedQuestions.length >= 5) {
            progress.sectionCompleted = true;
            progress.currentQuestion = 5;
        }

        await progress.save();

        // =========================
        // TAMBAH XP USER
        // HANYA JIKA SOAL BARU
        // =========================
        if (!alreadyCompleted) {
            const user = await User.findById(userId);

            if (user) {
                // maksimal 100 XP
                if (user.xp < 100) {
                    user.xp += 20;

                    if (user.xp > 100) {
                        user.xp = 100;
                    }

                    user.level = Math.floor(user.xp / 100) + 1;

                    await user.save();
                }
            }
        }

        return res.status(200).json({
            success: true,
            correct: true,
            nextQuestion: progress.currentQuestion,
            sectionCompleted: progress.sectionCompleted,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            error,
        });
    }
};

export const getRoadmapProgress = async (
    req: any,
    res: any
) => {
    try {
        const { userId } = req.query;

        const sections = await QuizSection.find().sort({
            order: 1,
        });

        const progress = await UserQuizProgress.find({
            userId,
        });

        res.status(200).json({
            success: true,
            sections,
            progress,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            error,
        });
    }
};