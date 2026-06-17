import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// ROUTES
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import accountRoutes from "./routes/accountRoutes";
import learningRoutes from "./routes/learningRoutes";
import nihongoRoutes from "./routes/nihongoRoutes";
import quizRoutes from "./routes/quizRoutes";

// LOAD ENV
dotenv.config();

// EXPRESS APP
const app = express();

// ==============================
// MIDDLEWARE
// ==============================
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==============================
// ROOT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ==============================
// API ROUTES
// ==============================

// AUTH
app.use(
  "/api/auth",
  authRoutes
);

// USERS
app.use(
  "/api/users",
  userRoutes
);

// ACCOUNT
app.use(
  "/api/account",
  accountRoutes
);

// LEARNING
app.use(
  "/api/learning",
  learningRoutes
);

// NIHONGO
app.use(
  "/api/nihongo", 
  nihongoRoutes
);

// Quiz
app.use(
  "/api/quiz",
  quizRoutes
);

// ==============================
// 404 HANDLER
// ==============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==============================
// DATABASE CONNECTION
// ==============================
const PORT =
  process.env.PORT || 5000;

const MONGO_URI =
  process.env.MONGO_URI;

if (!MONGO_URI) {

  throw new Error(
    "MONGO_URI is missing in .env"
  );

}

mongoose
  .connect(MONGO_URI)
  .then(() => {

    console.log(
      "Database:",
      mongoose.connection.db?.databaseName
    );

    app.listen(PORT, () => {

      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );

    });

  })
  .catch((error) => {

    console.log(
      "❌ MongoDB Error:",
      error
    );

  });