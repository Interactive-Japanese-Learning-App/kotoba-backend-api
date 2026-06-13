import { Router } from "express";
import {getNihongoByCategory,} from "../controllers/nihongoController";

const router = Router();

router.get("/:category", getNihongoByCategory);

export default router;