export const INITIAL_AI_MESSAGE = {
    id: "intro",
    type: "bot",
    body: "Hola, soy UniChat IA. Preguntame por recursos, tareas, examenes o tu proxima clase."
};

export const MAX_CACHED_MESSAGES = 40;
export const MAX_HISTORY_MESSAGES = 8;

function createMessageId(prefix) {
    if (crypto?.randomUUID) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeAiMessages(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
        return [INITIAL_AI_MESSAGE];
    }

    const normalizedMessages = messages
        .slice(-MAX_CACHED_MESSAGES)
        .map((message) => ({
            id: message.id || createMessageId(message.type ?? "bot"),
            type: message.type === "user" ? "user" : "bot",
            body: typeof message.body === "string" ? message.body : "",
            resources: Array.isArray(message.resources) ? message.resources : undefined,
            intent: typeof message.intent === "string" ? message.intent : undefined,
            courseFilter: message.courseFilter ?? null
        }))
        .filter((message) => message.body);

    if (normalizedMessages.length === 0) {
        return [INITIAL_AI_MESSAGE];
    }

    return normalizedMessages;
}

export function getRecentAiHistory(messages) {
    return messages.slice(-MAX_HISTORY_MESSAGES).map((message) => ({
        type: message.type,
        body: message.body,
        intent: message.intent,
        courseFilter: message.courseFilter
    }));
}

export function createUserAiMessage(body) {
    return {
        id: createMessageId("user"),
        type: "user",
        body
    };
}

export function createBotAiMessage(result) {
    return {
        id: createMessageId("bot"),
        type: "bot",
        body: result.answer,
        resources: result.resources,
        intent: result.intent,
        courseFilter: result.courseFilter
    };
}

export function createAiErrorMessage(error) {
    return {
        id: createMessageId("error"),
        type: "bot",
        body: `Error: ${error.message || "No pude procesar tu pregunta. Intenta de nuevo."}`
    };
}