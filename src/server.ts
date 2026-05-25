import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import accountRoutes from "./routes/accountRoutes";

// Load env
dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// ROUTES
// ======================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// USER ROUTES (admin manage users)
app.use("/api/users", userRoutes);

// ACCOUNT ROUTES (logged in user/admin)
app.use("/api/account", accountRoutes);

// ======================
// ERROR HANDLING (basic)
// ======================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ======================
// DATABASE + SERVER START
// ======================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });