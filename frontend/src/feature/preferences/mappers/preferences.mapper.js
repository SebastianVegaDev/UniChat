import { getPreferencesFormSchema } from "../api/preferences.api.js";
import {
    DEFAULT_CHAT_FONT_SIZE,
    DEFAULT_COLOR_PALETTE
} from "../constants/preferences.constants.js";

export const DEFAULT_PREFERENCES = {
    language: "English",
    chatWallpaperName: "",
    chatWallpaperUrl: "",
    colorPalette: DEFAULT_COLOR_PALETTE,
    chatFontSize: DEFAULT_CHAT_FONT_SIZE,
    showReadCheck: true
};

export function mapPreferencesFormData(preferencesData = DEFAULT_PREFERENCES) {
    const preferencesSchema = getPreferencesFormSchema(preferencesData);
    const palettes = preferencesSchema.palettes ?? [];

    return {
        formKey: preferencesData.updatedAt ?? [
            preferencesData.language,
            preferencesData.chatWallpaperName,
            preferencesData.chatWallpaperUrl,
            preferencesData.colorPalette,
            preferencesData.chatFontSize,
            preferencesData.showReadCheck
        ].join("-"),
        title: preferencesSchema.title ?? "Preferences",
        actions: preferencesSchema.actions ?? {
            reset: "Reset",
            save: "Save"
        },
        sections: (preferencesSchema.sections ?? []).map((section) => ({
            id: section.id,
            title: section.title ?? "",
            fields: (section.fields ?? []).map((field) => ({
                id: field.id,
                type: field.type ?? "text",
                title: field.title ?? "",
                description: field.description ?? "",
                emptyLabel: field.emptyLabel ?? "",
                defaultChecked: Boolean(field.defaultChecked),
                value: field.value ?? "",
                fileUrl: field.fileUrl ?? "",
                activePaletteId: field.activePaletteId ?? "",
                options: field.options ?? [],
                optionLabels: field.optionLabels ?? {},
                palettes
            }))
        }))
    };
}
