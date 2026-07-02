import {
    getStorageItem,
    getStorageJson,
    removeStorageItem,
    removeStorageItemsByPrefix,
    setStorageItem,
    setStorageJson
} from "../storage/localStorage.js";
import type { AuthSession, User } from "../types/app.types.js";

const AUTH_TOKEN_KEY = "token";
const AUTH_USER_KEY = "user";

const BOOTSTRAP_CACHE_PREFIX = "unichat_bootstrap_cache_";
const AI_CHAT_CACHE_PREFIX = "unichat_ai_chat_cache_";

export const STORAGE_PREFIXES = {
    bootstrapCache: BOOTSTRAP_CACHE_PREFIX,
    aiChatCache: AI_CHAT_CACHE_PREFIX
};

export function saveAuthSession(session: AuthSession | null | undefined): void {
    if (!session?.token) return;

    setStorageItem(AUTH_TOKEN_KEY, session.token);
    setStorageJson(AUTH_USER_KEY, session.user ?? null);
}

export function getAuthToken(): string | null {
    return getStorageItem(AUTH_TOKEN_KEY);
}

export function getAuthUser(): User | null {
    return getStorageJson<User | null>(AUTH_USER_KEY, null);
}

export function getAuthUserId(): number | "guest" {
    return getAuthUser()?.id ?? "guest";
}

export function hasAuthSession(): boolean {
    return Boolean(getAuthToken());
}

export function clearAuthSession(): void {
    removeStorageItem(AUTH_TOKEN_KEY);
    removeStorageItem(AUTH_USER_KEY);
}

export function getUserScopedStorageKey(prefix: string): string {
    return `${prefix}${getAuthUserId()}`;
}

export function clearUserScopedCaches(): void {
    removeStorageItemsByPrefix(BOOTSTRAP_CACHE_PREFIX);
    removeStorageItemsByPrefix(AI_CHAT_CACHE_PREFIX);
}

export function clearAuthStorage(): void {
    clearUserScopedCaches();
    clearAuthSession();
}
