import { fetchBootstrapData } from "../api/bootstrap.api.js";
import { getBootstrapCache, saveBootstrapCache } from "../cache/bootstrap.cache.js";

export async function getBootstrapData() {
    const cache = getBootstrapCache();

    try {
        const freshData = await fetchBootstrapData();

        saveBootstrapCache(freshData)

        return freshData;
    } catch (error) {
        if (cache?.data) return cache.data;

        throw error;
    }
}
