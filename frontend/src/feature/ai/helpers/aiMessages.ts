export interface AiResource {
    title?: string;
    url?: string;
    course?: string;
}

export interface AiMessage {
    id: string;
    type: "bot" | "user";
    body: string;
    resources?: AiResource[];
    intent?: string;
    courseFilter?: string | null;
}

interface AiAskResult {
    answer: string;
    resources?: AiResource[];
    intent?: string;
    courseFilter?: string | null;
}

export const INITIAL_AI_MESSAGE: AiMessage = {
    id: "intro",
    type: "bot",
    body: "Hola, soy UniChat IA. Preguntame por recursos, tareas, examenes o tu proxima clase."
};

export const MAX_CACHED_MESSAGES = 40;
export const MAX_HISTORY_MESSAGES = 8;

function createMessageId(prefix: string): string {
    if (crypto?.randomUUID) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeAiMessages(messages: unknown): AiMessage[] {
    if (!Array.isArray(messages) || messages.length === 0) {
        return [INITIAL_AI_MESSAGE];
    }

    const normalizedMessages = messages
        .slice(-MAX_CACHED_MESSAGES)
        .map((message) => {
            const value = message as Partial<AiMessage>;
            const type: AiMessage["type"] = value.type === "user" ? "user" : "bot";

            return {
                id: value.id || createMessageId(value.type ?? "bot"),
                type,
                body: typeof value.body === "string" ? value.body : "",
                resources: Array.isArray(value.resources) ? value.resources : undefined,
                intent: typeof value.intent === "string" ? value.intent : undefined,
                courseFilter: value.courseFilter ?? null
            };
        })
        .filter((message) => message.body);

    if (normalizedMessages.length === 0) {
        return [INITIAL_AI_MESSAGE];
    }

    return normalizedMessages;
}

export function getRecentAiHistory(messages: AiMessage[]) {
    return messages.slice(-MAX_HISTORY_MESSAGES).map((message) => ({
        type: message.type,
        body: message.body,
        intent: message.intent,
        courseFilter: message.courseFilter
    }));
}

export function createUserAiMessage(body: string): AiMessage {
    return {
        id: createMessageId("user"),
        type: "user",
        body
    };
}

export function createBotAiMessage(result: AiAskResult): AiMessage {
    return {
        id: createMessageId("bot"),
        type: "bot",
        body: result.answer,
        resources: result.resources,
        intent: result.intent,
        courseFilter: result.courseFilter
    };
}

export function createAiErrorMessage(error: unknown): AiMessage {
    const message = error instanceof Error ? error.message : "No pude procesar tu pregunta. Intenta de nuevo.";

    return {
        id: createMessageId("error"),
        type: "bot",
        body: `Error: ${message}`
    };
}
