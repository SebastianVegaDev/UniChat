import { getUserScopedStorageKey, STORAGE_PREFIXES } from "../../../shared/auth/sessionStorage.js";
import { getStorageJson, removeStorageItem, setStorageJson } from "../../../shared/storage/localStorage.js";
import { INITIAL_AI_MESSAGE, normalizeAiMessages } from "./aiMessages.js";
import type { AiMessage } from "./aiMessages.js";

const AI_CHAT_CACHE_VERSION = 1;

interface AiChatCache {
    version: number;
    savedAt: number;
    messages: AiMessage[];
}

function getAiChatCacheKey(): string {
    return getUserScopedStorageKey(STORAGE_PREFIXES.aiChatCache);
}

export function getCachedAiMessages(): AiMessage[] {
    const cacheKey = getAiChatCacheKey();
    const cache = getStorageJson<AiChatCache | null>(cacheKey, null);

    if (!cache) return [INITIAL_AI_MESSAGE];

    if (cache.version !== AI_CHAT_CACHE_VERSION) {
        removeStorageItem(cacheKey);
        return [INITIAL_AI_MESSAGE];
    }

    return normalizeAiMessages(cache.messages);
}

export function saveCachedAiMessages(messages: AiMessage[]): void {
    const cache = {
        version: AI_CHAT_CACHE_VERSION,
        savedAt: Date.now(),
        messages: normalizeAiMessages(messages)
    };

    setStorageJson(getAiChatCacheKey(), cache);
}
