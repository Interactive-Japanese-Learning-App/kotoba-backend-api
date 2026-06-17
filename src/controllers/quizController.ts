import QuizSection from "../models/QuizSection";
import QuizQuestion from "../models/QuizQuestion";
import UserQuizProgress from "../models/UserQuizProgress";

export const getSections = async (req: any, res: any) => {
    try {
        const sections = await QuizSection.find()
            .sort({ order: 1 });

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

export const getQuestionsBySection =
    async (req: any, res: any) => {
        try {
            const { sectionId } = req.params;

            const questions =
                await QuizQuestion.find({
                    sectionId,
                }).sort({ questionNo: 1 });

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

export const getProgress =
    async (req: any, res: any) => {

        try {

            const {
                userId,
                sectionId
            } = req.query;

            let progress =
                await UserQuizProgress.findOne({
                    userId,
                    sectionId,
                });

            if (!progress) {

                progress =
                    await UserQuizProgress.create({
                        userId,
                        sectionId,
                        currentQuestion: 1,
                        sectionCompleted: false,
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

export const submitAnswer =
    async (req: any, res: any) => {

        try {

            const {
                userId,
                sectionId,
                questionNo,
                answer,
            } = req.body;

            const question =
                await QuizQuestion.findOne({
                    sectionId,
                    questionNo,
                });

            if (!question) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Soal tidak ditemukan",
                });

            }

            const isCorrect =
                question.answer === answer;

            if (!isCorrect) {

                return res.status(200).json({
                    success: true,
                    correct: false,
                });

            }

            let progress =
                await UserQuizProgress.findOne({
                    userId,
                    sectionId,
                });

            if (!progress) {

                progress =
                    await UserQuizProgress.create({
                        userId,
                        sectionId,
                        currentQuestion: 1,
                    });

            }

            progress.currentQuestion =
                questionNo + 1;

            if (questionNo >= 5) {

                progress.sectionCompleted =
                    true;

            }

            await progress.save();

            res.status(200).json({
                success: true,
                correct: true,
                nextQuestion:
                    progress.currentQuestion,
                sectionCompleted:
                    progress.sectionCompleted,
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                error,
            });

        }

    };

export const getRoadmapProgress =
    async (req: any, res: any) => {

        try {

            const { userId } = req.query;

            const sections =
                await QuizSection.find()
                    .sort({ order: 1 });

            const progress =
                await UserQuizProgress.find({
                    userId,
                });

            res.status(200).json({
                success: true,
                sections,
                progress,
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                error,
            });

        }

    };