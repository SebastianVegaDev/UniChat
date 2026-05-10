import { fetchBootstrapData } from "../api/bootstrap.api.js";
import { getBootstrapCache, saveBootstrapCache, isBootstrapCacheValid } from "../cache/bootstrap.cache.js";

export async function getBootstrapData() {
    const cache = getBootstrapCache();

    if (cache && isBootstrapCacheValid(cache)) {
        return cache.data;
    }

    const freshData = await fetchBootstrapData();

    saveBootstrapCache(freshData)

    return freshData;
}