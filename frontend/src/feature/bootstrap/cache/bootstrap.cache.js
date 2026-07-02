import { getUserScopedStorageKey, STORAGE_PREFIXES } from "../../../shared/auth/sessionStorage.js";
import { getStorageJson, setStorageJson } from "../../../shared/storage/localStorage.js";

const CACHE_TIME = 1000 * 60 * 10;
const BOOTSTRAP_CACHE_VERSION = 1;

function getBootstrapCacheKey() {
    return getUserScopedStorageKey(STORAGE_PREFIXES.bootstrapCache);
}

export function saveBootstrapCache(data) {
    const cache = {
        data,
        savedAt: Date.now(),
        version: BOOTSTRAP_CACHE_VERSION
    };

    setStorageJson(getBootstrapCacheKey(), cache);
}

export function getBootstrapCache() {
    return getStorageJson(getBootstrapCacheKey(), null);
}

export function isBootstrapCacheValid(cache) {
    if (!cache?.savedAt) return false;
    if (cache.version !== BOOTSTRAP_CACHE_VERSION) return false;

    const now = Date.now();
    const cacheAge = now - cache.savedAt;

    return cacheAge < CACHE_TIME;
}