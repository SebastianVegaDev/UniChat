import { useCallback, useEffect, useMemo, useState } from "react";
import {
    fetchPreferencesFormData,
    savePreferencesFormData
} from "../api/preferences.api.js";
import {
    DEFAULT_PREFERENCES,
    mapPreferencesFormData
} from "../mappers/preferences.mapper.js";
import {
    getPreferenceAppClassName,
    getPreferenceAppStyle,
    getPreferenceTexts
} from "../constants/preferences.constants.js";

export function usePreferences() {
    const [preferencesData, setPreferencesData] = useState(DEFAULT_PREFERENCES);

    const updatePreferencesData = useCallback((data) => {
        setPreferencesData({
            ...DEFAULT_PREFERENCES,
            ...data
        });
    }, []);

    useEffect(() => {
        let isCancelled = false;

        async function loadPreferences() {
            try {
                const preferences = await fetchPreferencesFormData();

                if (!isCancelled) {
                    updatePreferencesData(preferences);
                }
            } catch (error) {
                console.log(error);
            }
        }

        loadPreferences();

        return () => {
            isCancelled = true;
        };
    }, [updatePreferencesData]);

    const activePreferencesData = preferencesData;

    const preferencesForm = useMemo(() => {
        return mapPreferencesFormData(activePreferencesData);
    }, [activePreferencesData]);

    const preferencesClassName = useMemo(() => {
        return getPreferenceAppClassName(activePreferencesData);
    }, [activePreferencesData]);

    const preferencesStyle = useMemo(() => {
        return getPreferenceAppStyle(activePreferencesData);
    }, [activePreferencesData]);

    const preferencesTexts = useMemo(() => {
        return getPreferenceTexts(activePreferencesData.language);
    }, [activePreferencesData.language]);

    const handleSubmitPreferences = useCallback(async (values) => {
        try {
            const savedPreferences = await savePreferencesFormData(values);

            updatePreferencesData(savedPreferences);

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }, [updatePreferencesData]);

    return {
        preferencesData,
        activePreferencesData,
        preferencesForm,
        preferencesClassName,
        preferencesStyle,
        preferencesTexts,
        handleSubmitPreferences
    };
}
