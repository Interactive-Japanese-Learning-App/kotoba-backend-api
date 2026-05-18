import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

//
// ROUTES
//
app.use("/api", authRoutes);

//
// TEST API
//
app.get("/", (req, res) => {
  res.send("KOTOBA API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});