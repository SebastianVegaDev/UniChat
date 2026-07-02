import { env } from "../config/env.js";
import type { AiHistoryMessage, AiIntent } from "../modules/ai/types/ai.types.js";
import { validateRequiredString } from "./common.validator.js";

const AI_INTENTS = new Set<AiIntent>([
    "gratitude",
    "farewell",
    "greeting",
    "preferences",
    "chat_help",
    "study_help",
    "exams",
    "tasks",
    "resources",
    "events",
    "general"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object";
}

function getIntent(value: unknown): AiIntent | null {
    return typeof value === "string" && AI_INTENTS.has(value as AiIntent)
        ? value as AiIntent
        : null;
}

function validateAiHistory(history: unknown): AiHistoryMessage[] {
    if (!Array.isArray(history)) return [];

    return history
        .slice(-8)
        .map((message): AiHistoryMessage => {
            const record = isRecord(message) ? message : {};
            const courseFilter = isRecord(record.courseFilter) ? record.courseFilter : null;

            return {
                type: record.type === "user" ? "user" : "bot",
                body: typeof record.body === "string" ? record.body.trim().slice(0, 1000) : "",
                intent: getIntent(record.intent),
                courseFilter: courseFilter
                ? {
                    courseId: Number(courseFilter.courseId) || undefined,
                    courseTitle: typeof courseFilter.courseTitle === "string" ? courseFilter.courseTitle : "",
                    courseShortName: typeof courseFilter.courseShortName === "string" ? courseFilter.courseShortName : "",
                    courseSlug: typeof courseFilter.courseSlug === "string" ? courseFilter.courseSlug : ""
                }
                : null
            };
        })
        .filter((message) => message.body);
}

export function validateAcademicQuestionRequest(body: Record<string, unknown> = {}) {
    return {
        question: validateRequiredString(body.question, "Question", 1000),
        history: validateAiHistory(body.history)
    };
}

export function validateAiSpeechRequest(body: Record<string, unknown> = {}) {
    const maxLength = env.aws.polly.maxChars;

    return {
        text: validateRequiredString(body.text, "Text", maxLength)
    };
}
