import { Router } from "express";
import { getYoutubeData } from "../controllers/youtubeController";

const router = Router();

router.get("/", getYoutubeData);

export default router;