import { FOLLOWABLE_INTENTS } from "../intents/intent.constants.js";

export function getPreviousUserQuestion(history = []) {
    const previousUserMessage = [...history]
        .reverse()
        .find((message) => message.type === "user" && message.body);

    return previousUserMessage?.body ?? "";
}

export function getPreviousResolvedContext(history = []) {
    const previousBotMessage = [...history]
        .reverse()
        .find((message) => message.type === "bot" && FOLLOWABLE_INTENTS.has(message.intent));

    if (!previousBotMessage) {
        return {
            intent: null,
            courseFilter: null
        };
    }

    return {
        intent: previousBotMessage.intent,
        courseFilter: previousBotMessage.courseFilter ?? null
    };
}