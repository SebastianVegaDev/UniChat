import { useEffect, useState } from "react";
import { getBootstrapData } from "../service/bootstrap.service.js";

export function useBootstrapData() {
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

    return {
        data,
        isLoading,
        error
    };
}