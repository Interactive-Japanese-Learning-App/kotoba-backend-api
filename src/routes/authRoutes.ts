import express from "express";

import {
  registerAdmin,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerAdmin);

export default router;