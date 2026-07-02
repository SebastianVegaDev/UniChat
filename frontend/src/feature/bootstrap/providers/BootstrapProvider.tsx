import { useCallback, useEffect, useMemo, useState } from "react";
import { saveBootstrapCache } from "../cache/bootstrap.cache.js";
import { BootstrapContext } from "../context/BootstrapContext.js";
import { getBootstrapData } from "../service/bootstrap.service.js";
import { useRealtime } from "../../realtime/useRealtime.js";
import type { ChildrenProps, BootstrapData, Updater } from "../../../shared/types/app.types.js";

export function BootstrapProvider({ children }: ChildrenProps) {
    const [data, setData] = useState<BootstrapData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const bootstrapData = await getBootstrapData();
                setData(bootstrapData);
            } catch (error) {
                setError(error instanceof Error ? error.message : "No se pudo cargar UniChat");
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    const updateBootstrap = useCallback((updater: Updater<BootstrapData>) => {
        setData((currentData) => {
            if (!currentData) return currentData;

            const nextData = typeof updater === "function" ? updater(currentData) : updater;

            if (!nextData) return currentData;

            saveBootstrapCache(nextData);

            return nextData;
        });
    }, []);

    useRealtime({
        data,
        updateBootstrap
    });

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
