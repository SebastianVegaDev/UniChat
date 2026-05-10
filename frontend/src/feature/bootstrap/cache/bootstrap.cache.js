const BOOTSTRAP_CACHE_KEY = "unichat_bootstrap_cache";
const CACHE_TIME = 1000 * 60 * 5;

export function saveBootstrapCache(data) {
    const cache = {
        data,
        savedAt: Date.now(),
        version: 1,
    };

    localStorage.setItem(BOOTSTRAP_CACHE_KEY, JSON.stringify(cache));
}

export function getBootstrapCache() {
    const cache = localStorage.getItem(BOOTSTRAP_CACHE_KEY);

    if(!cache) return null;
    
    try {
        return JSON.parse(cache);
    } catch {
        localStorage.removeItem(BOOTSTRAP_CACHE_KEY)
        return null;
    }
}

export function isBootstrapCacheValid(cache) {
    if (!cache?.savedAt) return false;

    const now = Date.now();
    const cacheAge = now - cache.savedAt;

    return cacheAge < CACHE_TIME;
}
