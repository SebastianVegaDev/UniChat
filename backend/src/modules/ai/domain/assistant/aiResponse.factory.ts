import type { AiUseCaseResponse, QuestionAnalysis } from "../../types/ai.types.js";

type AiResponsePayload = Omit<AiUseCaseResponse, "intent" | "courseFilter">;

export function buildResponse(analysis: QuestionAnalysis, payload: AiResponsePayload): AiUseCaseResponse {
    return {
        intent: analysis.currentIntent,
        courseFilter: analysis.courseFilter
            ? {
                courseId: analysis.courseFilter.courseId,
                courseTitle: analysis.courseFilter.courseTitle,
                courseShortName: analysis.courseFilter.courseShortName,
                courseSlug: analysis.courseFilter.courseSlug
            }
            : null,
        ...payload
    };
}
