const CACHE_TIME = 1000 * 60 * 10;

function getBootstrapCacheKey() {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return `unichat_bootstrap_cache_${user?.id ?? "guest"}`;
}

export function saveBootstrapCache(data) {
    const cacheKey = getBootstrapCacheKey();

    const cache = {
        data,
        savedAt: Date.now(),
        version: 1,
    };

    localStorage.setItem(cacheKey, JSON.stringify(cache));
}

export function getBootstrapCache() {
    const cacheKey = getBootstrapCacheKey();
    const cache = localStorage.getItem(cacheKey);

    if(!cache) return null;
    
    try {
        return JSON.parse(cache);
    } catch {
        localStorage.removeItem(cacheKey)
        return null;
    }
}

export function isBootstrapCacheValid(cache) {
    if (!cache?.savedAt) return false;

    const now = Date.now();
    const cacheAge = now - cache.savedAt;

    return cacheAge < CACHE_TIME;
}
