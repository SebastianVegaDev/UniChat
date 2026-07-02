import { Router } from "express";
import { answerAcademicQuestion, synthesizeSpeech } from "./ai.controller.js";

const router = Router();

router.post("/resources/ask", answerAcademicQuestion);
router.post("/speech", synthesizeSpeech);

export default router;