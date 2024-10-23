import { Router } from "express";
import { getCurrentQuestion } from "../controllers/questionController";

const router = Router();

router.get("/question", getCurrentQuestion);

export default router;
