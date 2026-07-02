import { apiPost } from "../../../shared/api/client.js";

export function askAiResources({ question, history }) {
    return apiPost("/ai/resources/ask", {
        question,
        history
    });
}

export function fetchAiSpeech(text) {
    return apiPost("/ai/speech", {
        text
    });
}