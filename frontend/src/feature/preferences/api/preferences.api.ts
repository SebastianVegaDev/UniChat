import { apiFormPatch, apiGet, apiPatch } from "../../../shared/api/client.js";
import type { Preferences, PreferencesFormValues } from "../../../shared/types/app.types.js";
import {
    CHAT_FONT_SIZES,
    COLOR_PALETTES,
    DEFAULT_CHAT_FONT_SIZE,
    DEFAULT_COLOR_PALETTE,
    LANGUAGES,
    getPreferenceTexts
} from "../constants/preferences.constants.js";

export async function fetchPreferencesFormData(): Promise<Preferences> {
    return apiGet<Preferences>("/preferences");
}

export async function savePreferencesFormData(preferencesData: PreferencesFormValues): Promise<Preferences> {
    const { chatWallpaperFile, chatWallpaperName, removeChatWallpaper, ...values } = preferencesData;
    const nextValues = {
        ...values,
        chatWallpaperName: removeChatWallpaper ? "" : chatWallpaperName,
        chatWallpaperUrl: removeChatWallpaper ? "" : values.chatWallpaperUrl
    };

    if (!chatWallpaperFile) {
        return apiPatch<Preferences>("/preferences", nextValues);
    }

    const formData = new FormData();

    Object.entries(nextValues).forEach(([key, value]) => {
        formData.append(key, String(value ?? ""));
    });

    formData.append("file", chatWallpaperFile, chatWallpaperName || chatWallpaperFile.name);

    return apiFormPatch<Preferences>("/preferences", formData);
}

export function getPreferencesFormSchema(preferences: Partial<Preferences> = {}) {
    const texts = getPreferenceTexts(preferences.language);
    const preferencesTexts = texts.preferences;
    const palettes = COLOR_PALETTES.map((palette) => ({
        ...palette,
        label: preferencesTexts.paletteLabels[palette.id] ?? palette.label
    }));

    return {
        title: preferencesTexts.title,
        actions: {
            reset: preferencesTexts.reset,
            save: preferencesTexts.save
        },
        sections: [
            {
                id: "general",
                title: preferencesTexts.general,
                fields: [
                    {
                        id: "language",
                        type: "select",
                        title: preferencesTexts.language,
                        value: preferences.language ?? "English",
                        options: LANGUAGES,
                        optionLabels: preferencesTexts.languageOptions
                    }
                ]
            },
            {
                id: "chatAppearance",
                title: preferencesTexts.chatAppearance,
                fields: [
                    {
                        id: "chatWallpaper",
                        type: "file",
                        title: preferencesTexts.chatWallpaper,
                        description: preferencesTexts.chatWallpaperDescription,
                        emptyLabel: preferencesTexts.noWallpaperSelected,
                        removeLabel: preferencesTexts.removeWallpaper,
                        value: preferences.chatWallpaperName ?? "",
                        fileUrl: preferences.chatWallpaperUrl ?? ""
                    },
                    {
                        id: "colorPalette",
                        type: "palette",
                        title: preferencesTexts.colorPalette,
                        activePaletteId: preferences.colorPalette ?? DEFAULT_COLOR_PALETTE
                    },
                    {
                        id: "chatFontSize",
                        type: "range",
                        title: preferencesTexts.chatFontSize,
                        value: preferences.chatFontSize ?? DEFAULT_CHAT_FONT_SIZE,
                        options: CHAT_FONT_SIZES,
                        optionLabels: preferencesTexts.fontSizeLabels
                    }
                ]
            },
            {
                id: "messageBehavior",
                title: preferencesTexts.messageBehavior,
                fields: [
                    {
                        id: "showReadCheck",
                        type: "checkbox",
                        title: preferencesTexts.showReadCheck,
                        defaultChecked: preferences.showReadCheck !== false
                    }
                ]
            }
        ],
        palettes
    };
}
