import { validateRequiredString } from "./common.validator.js";

function validateAiHistory(history) {
    if (!Array.isArray(history)) return [];

    return history
        .slice(-8)
        .map((message) => ({
            type: message?.type === "user" ? "user" : "bot",
            body: typeof message?.body === "string" ? message.body.trim().slice(0, 1000) : "",
            intent: typeof message?.intent === "string" ? message.intent : "",
            courseFilter: message?.courseFilter && typeof message.courseFilter === "object"
                ? {
                    courseId: message.courseFilter.courseId,
                    courseTitle: typeof message.courseFilter.courseTitle === "string" ? message.courseFilter.courseTitle : "",
                    courseShortName: typeof message.courseFilter.courseShortName === "string" ? message.courseFilter.courseShortName : "",
                    courseSlug: typeof message.courseFilter.courseSlug === "string" ? message.courseFilter.courseSlug : ""
                }
                : null
        }))
        .filter((message) => message.body);
}

export function validateResourceAiQuestion(body = {}) {
    return {
        question: validateRequiredString(body.question, "Question", 1000),
        history: validateAiHistory(body.history)
    };
}

export function validateAiSpeechRequest(body = {}) {
    const maxLength = Number(process.env.AWS_POLLY_MAX_CHARS ?? 2500);

    return {
        text: validateRequiredString(body.text, "Text", maxLength)
    };
}
