import { Router } from "express";
import {
  getNihongoByCategory,
  createNihongo,
  updateNihongo,
  deleteNihongo,
} from "../controllers/nihongoController";

const router = Router();

router.get("/:category", getNihongoByCategory);

router.post("/:category", createNihongo);

router.put("/:category/:id", updateNihongo);

router.delete("/:category/:id", deleteNihongo);

export default router;