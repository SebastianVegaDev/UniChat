import { useCallback, useEffect, useMemo, useState } from "react";
import { saveBootstrapCache } from "../cache/bootstrap.cache.js";
import { BootstrapContext } from "../context/BootstrapContext.js";
import { getBootstrapData } from "../service/bootstrap.service.js";

export function BootstrapProvider({ children }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                const bootstrapData = await getBootstrapData();
                setData(bootstrapData);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    const updateBootstrap = useCallback((updater) => {
        setData((currentData) => {
            if (!currentData) return currentData;

            const nextData = typeof updater === "function" ? updater(currentData) : updater;

            if (!nextData) return currentData;

            saveBootstrapCache(nextData);

            return nextData;
        });
    }, []);

    const value = useMemo(() => ({
        data,
        isLoading,
        error,
        updateBootstrap
    }), [data, isLoading, error, updateBootstrap]);

    return (
        <BootstrapContext.Provider value={value}>
            {children}
        </BootstrapContext.Provider>
    );
}
