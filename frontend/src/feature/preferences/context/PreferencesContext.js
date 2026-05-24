import { createContext, useContext } from "react";
import { getPreferenceTexts } from "../constants/texts.js";

const defaultPreferences = {
    language: "English",
    colorPalette: "dark",
    chatFontSize: "Medium",
    showReadCheck: true,
    chatWallpaperName: "",
    chatWallpaperUrl: ""
};

const defaultContextValue = {
    preferences: defaultPreferences,
    texts: getPreferenceTexts(defaultPreferences.language)
};

export const PreferencesContext = createContext(defaultContextValue);

export function usePreferenceSettings() {
    return useContext(PreferencesContext);
}

export function usePreferenceTexts() {
    return usePreferenceSettings().texts;
}
