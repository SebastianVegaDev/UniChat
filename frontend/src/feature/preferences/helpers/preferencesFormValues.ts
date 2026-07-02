export function findPreferenceField(preferences, fieldId) {
    return preferences.sections
        .flatMap((section) => section.fields)
        .find((field) => field.id === fieldId);
}

export function getPreferencesFormValues(preferences) {
    return {
        language: findPreferenceField(preferences, "language")?.value ?? "English",
        chatWallpaperName: findPreferenceField(preferences, "chatWallpaper")?.value ?? "",
        chatWallpaperUrl: findPreferenceField(preferences, "chatWallpaper")?.fileUrl ?? "",
        chatWallpaperFile: null,
        removeChatWallpaper: false,
        colorPalette: findPreferenceField(preferences, "colorPalette")?.activePaletteId ?? "dark",
        chatFontSize: findPreferenceField(preferences, "chatFontSize")?.value ?? "Medium",
        showReadCheck: findPreferenceField(preferences, "showReadCheck")?.defaultChecked ?? true
    };
}