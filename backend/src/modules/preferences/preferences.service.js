import {
    createDefaultUserPreferences,
    updateUserPreferences
} from "./preferences.repository.js";
import { validatePreferences } from "../../validators/preferences.validator.js";
import {
    deletePreferenceWallpaper,
    getPreferenceWallpaperData
} from "./preferences.helper.js";
import { BadRequestError } from "../../errors/index.js";

export async function getPreferencesService(userId) {
    return await createDefaultUserPreferences(userId);
}

export async function updatePreferencesService(userId, data) {
    const currentPreferences = await createDefaultUserPreferences(userId);
    const preferences = validatePreferences({
        ...currentPreferences,
        ...data
    });

    return await updateUserPreferences({
        userId,
        ...preferences
    });
}

export async function updatePreferencesWithWallpaperService(userId, data, file) {
    const currentPreferences = await createDefaultUserPreferences(userId);
    const wallpaperData = getPreferenceWallpaperData(file);
    const shouldRemoveWallpaper = data.chatWallpaperName === "" && data.chatWallpaperUrl === "";
    const preferences = validatePreferences({
        ...currentPreferences,
        ...data,
        ...(wallpaperData ?? {})
    });

    let savedPreferences;

    try {
        savedPreferences = await updateUserPreferences({
            userId,
            ...preferences
        });
    } catch (error) {
        await deletePreferenceWallpaper(wallpaperData?.chatWallpaperUrl);

        throw error;
    }

    if ((wallpaperData || shouldRemoveWallpaper) && currentPreferences.chatWallpaperUrl !== savedPreferences.chatWallpaperUrl) {
        await deletePreferenceWallpaper(currentPreferences.chatWallpaperUrl);
    }

    return savedPreferences;
}

export async function updatePreferenceWallpaperService(userId, file) {
    if (!file) {
        throw new BadRequestError("Wallpaper is required");
    }

    return await updatePreferencesWithWallpaperService(userId, {}, file);
}
