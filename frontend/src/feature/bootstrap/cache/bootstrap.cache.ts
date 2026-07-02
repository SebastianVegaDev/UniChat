import { getUserScopedStorageKey, STORAGE_PREFIXES } from "../../../shared/auth/sessionStorage.js";
import { getStorageJson, setStorageJson } from "../../../shared/storage/localStorage.js";
import type { BootstrapData } from "../../../shared/types/app.types.js";

const CACHE_TIME = 1000 * 60 * 10;
const BOOTSTRAP_CACHE_VERSION = 1;

interface BootstrapCache {
    data: BootstrapData;
    savedAt: number;
    version: number;
}

function getBootstrapCacheKey(): string {
    return getUserScopedStorageKey(STORAGE_PREFIXES.bootstrapCache);
}

export function saveBootstrapCache(data: BootstrapData): void {
    const cache = {
        data,
        savedAt: Date.now(),
        version: BOOTSTRAP_CACHE_VERSION
    };

    setStorageJson(getBootstrapCacheKey(), cache);
}

export function getBootstrapCache(): BootstrapCache | null {
    return getStorageJson<BootstrapCache | null>(getBootstrapCacheKey(), null);
}

export function isBootstrapCacheValid(cache: BootstrapCache | null): boolean {
    if (!cache?.savedAt) return false;
    if (cache.version !== BOOTSTRAP_CACHE_VERSION) return false;

    const now = Date.now();
    const cacheAge = now - cache.savedAt;

    return cacheAge < CACHE_TIME;
}
