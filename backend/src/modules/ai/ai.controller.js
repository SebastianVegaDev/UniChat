import { validateAiSpeechRequest, validateResourceAiQuestion } from "../../validators/ai.validator.js";
import { answerResourceAiQuestionService } from "./ai.service.js";
import { synthesizeSpeechService } from "./polly.service.js";

export async function answerResourceAiQuestion(req, res, next) {
    try {
        const { question, history } = validateResourceAiQuestion(req.body);
        const result = await answerResourceAiQuestionService({
            userId: req.user.id,
            question,
            history
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function synthesizeSpeech(req, res, next) {
    try {
        const { text } = validateAiSpeechRequest(req.body);
        const result = await synthesizeSpeechService({ text });

        res.json({
            provider: "amazon-polly",
            ...result
        });
    } catch (error) {
        next(error);
    }
}
