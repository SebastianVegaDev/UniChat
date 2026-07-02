import { getUserScopedStorageKey, STORAGE_PREFIXES } from "../../../shared/auth/sessionStorage.js";
import { getStorageJson, removeStorageItem, setStorageJson } from "../../../shared/storage/localStorage.js";
import { INITIAL_AI_MESSAGE, normalizeAiMessages } from "./aiMessages.js";

const AI_CHAT_CACHE_VERSION = 1;

function getAiChatCacheKey() {
    return getUserScopedStorageKey(STORAGE_PREFIXES.aiChatCache);
}

export function getCachedAiMessages() {
    const cacheKey = getAiChatCacheKey();
    const cache = getStorageJson(cacheKey, null);

    if (!cache) return [INITIAL_AI_MESSAGE];

    if (cache.version !== AI_CHAT_CACHE_VERSION) {
        removeStorageItem(cacheKey);
        return [INITIAL_AI_MESSAGE];
    }

    return normalizeAiMessages(cache.messages);
}

export function saveCachedAiMessages(messages) {
    const cache = {
        version: AI_CHAT_CACHE_VERSION,
        savedAt: Date.now(),
        messages: normalizeAiMessages(messages)
    };

    setStorageJson(getAiChatCacheKey(), cache);
}