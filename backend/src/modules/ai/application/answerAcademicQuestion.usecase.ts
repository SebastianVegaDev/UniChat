import { buildResponse } from "../domain/assistant/aiResponse.factory.js";
import { getAmbiguousCourseAnswer } from "../domain/assistant/fallbackAnswers.js";
import { getSocialAnswer } from "../domain/assistant/socialAnswers.js";
import { buildCourseIndex } from "../domain/courses/courseIndex.js";
import { buildEventsAnswer } from "../domain/events/eventAnswer.builder.js";
import { buildNextClassAnswer } from "../domain/events/nextClassAnswer.builder.js";
import { analyzeQuestion } from "../domain/intents/questionAnalyzer.js";
import { isNextClassQuestion } from "../domain/intents/intent.detector.js";
import { buildResourcesAnswer } from "../domain/resources/resourceAnswer.builder.js";
import { buildDefinitionsContext } from "../domain/resources/resourceDefinitionText.js";
import { mapResourcesForResponse } from "../domain/resources/resourceResponse.mapper.js";
import { filterResourcesByAnalysis, selectResources } from "../domain/resources/resourceSelector.js";
import { getOrCreateDefinition } from "./resourceDefinitions.service.js";
import { answerWithOpenAi } from "../infrastructure/openai/openaiAcademicAssistant.js";
import {
    findAiAccessibleResources,
    findAiAccessibleCalendarEvents,
    findAiAccessibleClassSessions
} from "../repositories/aiAcademicData.repository.js";
import { env } from "../../../config/env.js";
import type { AcademicQuestionInput, AiResource, AiUseCaseResponse, QuestionAnalysis } from "../types/ai.types.js";

interface OpenAiAnswerInput {
    question: string;
    analysis: QuestionAnalysis;
    resources: readonly AiResource[];
}

async function buildOpenAiAnswer({
    question,
    analysis,
    resources
}: OpenAiAnswerInput): Promise<AiUseCaseResponse> {
    const selectedResources = selectResources(resources, question);

    if (selectedResources.length === 0) {
        return buildResponse(analysis, {
            needsResource: false,
            answer: await answerWithOpenAi({
                question,
                analysis,
                context: "",
                maxOutputTokens: analysis.currentIntent === "study_help" ? 360 : 240
            })
        });
    }

    const definitions = await Promise.all(
        selectedResources.map(getOrCreateDefinition)
    );
    const resourceContext = buildDefinitionsContext(selectedResources, definitions);

    return buildResponse(analysis, {
        needsResource: false,
        answer: await answerWithOpenAi({
            question,
            analysis,
            context: resourceContext,
            maxOutputTokens: Number(env.openAi.maxOutputTokens ?? 360)
        }),
        resources: mapResourcesForResponse(selectedResources)
    });
}

export async function answerAcademicQuestionUseCase({
    userId,
    question,
    history = []
}: AcademicQuestionInput): Promise<AiUseCaseResponse> {
    const [resources, events, classSessions] = await Promise.all([
        findAiAccessibleResources(userId),
        findAiAccessibleCalendarEvents(userId),
        findAiAccessibleClassSessions(userId)
    ]);
    const courses = buildCourseIndex(resources, events, classSessions);
    const analysis = analyzeQuestion({
        question,
        history,
        courses
    });
    const socialAnswer = getSocialAnswer(analysis.currentIntent);

    if (socialAnswer) {
        return buildResponse(analysis, {
            needsResource: false,
            answer: socialAnswer
        });
    }

    if (isNextClassQuestion(question)) {
        return buildResponse({ ...analysis, currentIntent: "events" }, {
            needsResource: false,
            answer: buildNextClassAnswer(classSessions, events, question)
        });
    }

    if (["exams", "tasks", "events"].includes(analysis.currentIntent)) {
        return buildResponse(analysis, {
            needsResource: false,
            answer: buildEventsAnswer(events, question, analysis)
        });
    }

    if (analysis.currentIntent === "resources") {
        const filteredResources = filterResourcesByAnalysis(resources, analysis);

        return buildResponse(analysis, {
            needsResource: false,
            answer: buildResourcesAnswer(resources, analysis),
            resources: mapResourcesForResponse(filteredResources.slice(0, 6))
        });
    }

    if (analysis.currentIntent === "general" && analysis.courseFilter) {
        return buildResponse(analysis, {
            needsResource: false,
            answer: getAmbiguousCourseAnswer(analysis.courseFilter)
        });
    }

    return buildOpenAiAnswer({
        question,
        analysis,
        resources
    });
}
