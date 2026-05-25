import { Router } from "express";
import { answerResourceAiQuestion, synthesizeSpeech } from "./ai.controller.js";

const router = Router();

router.post("/resources/ask", answerResourceAiQuestion);
router.post("/speech", synthesizeSpeech);

export default router;
