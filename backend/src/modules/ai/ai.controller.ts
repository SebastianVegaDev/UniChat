import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { validateAcademicQuestionRequest, validateAiSpeechRequest } from "../../validators/ai.validator.js";
import { answerAcademicQuestionUseCase } from "./application/answerAcademicQuestion.usecase.js";
import { synthesizeSpeechUseCase } from "./application/synthesizeSpeech.usecase.js";

export const answerAcademicQuestion = asyncHandler(async (req, res) => {
    const { question, history } = validateAcademicQuestionRequest(req.body);
    const result = await answerAcademicQuestionUseCase({
        userId: req.user.id,
        question,
        history
    });

    res.json(result);
});


export const synthesizeSpeech = asyncHandler(async (req, res, next) => {
    const { text } = validateAiSpeechRequest(req.body);
    const result = await synthesizeSpeechUseCase({ text });

    res.json(result);
});