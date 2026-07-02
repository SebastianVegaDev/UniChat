import { apiPost } from "../../../shared/api/client.js";
import type { AiMessage, AiResource } from "../helpers/aiMessages.js";

interface AskAiResourcesRequest {
    question: string;
    history: Array<Pick<AiMessage, "type" | "body" | "intent" | "courseFilter">>;
}

interface AskAiResourcesResponse {
    answer: string;
    resources?: AiResource[];
    intent?: string;
    courseFilter?: string | null;
}

interface AiSpeechResponse {
    audioBase64: string;
    contentType: string;
}

export function askAiResources({ question, history }: AskAiResourcesRequest): Promise<AskAiResourcesResponse> {
    return apiPost<AskAiResourcesResponse>("/ai/resources/ask", {
        question,
        history
    });
}

export function fetchAiSpeech(text: string): Promise<AiSpeechResponse> {
    return apiPost<AiSpeechResponse>("/ai/speech", {
        text
    });
}
