import { FOLLOWABLE_INTENTS } from "../intents/intent.constants.js";
import type { AiHistoryMessage, AiIntent, FollowableIntent } from "../../types/ai.types.js";
import type { CourseFilter } from "../../../../shared/types/domain.types.js";

function isFollowableIntent(intent: AiIntent | null | undefined): intent is FollowableIntent {
    return Boolean(intent) && FOLLOWABLE_INTENTS.has(intent as FollowableIntent);
}

export function getPreviousUserQuestion(history: readonly AiHistoryMessage[] = []): string {
    const previousUserMessage = [...history]
        .reverse()
        .find((message) => message.type === "user" && message.body);

    return previousUserMessage?.body ?? "";
}

export function getPreviousResolvedContext(history: readonly AiHistoryMessage[] = []): {
    intent: AiIntent | null;
    courseFilter: CourseFilter | null;
} {
    const previousBotMessage = [...history]
        .reverse()
        .find((message) => message.type === "bot" && isFollowableIntent(message.intent));

    if (!previousBotMessage) {
        return {
            intent: null,
            courseFilter: null
        };
    }

    return {
        intent: previousBotMessage.intent ?? null,
        courseFilter: previousBotMessage.courseFilter ?? null
    };
}
