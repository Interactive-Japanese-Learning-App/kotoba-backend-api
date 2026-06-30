import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import accountRoutes from "./routes/accountRoutes";
import learningRoutes from "./routes/learningRoutes";
import nihongoRoutes from "./routes/nihongoRoutes";
import quizRoutes from "./routes/quizRoutes";
import activityLogRoutes from "./routes/activityRoutes";
import youtubeRoutes from "./routes/youtubeRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/nihongo", nihongoRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/activity", activityLogRoutes);
app.use("/api/youtube", youtubeRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;