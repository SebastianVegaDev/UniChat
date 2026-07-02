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
import type { Express } from "express";
import type { DatabaseRow, EntityId, RequestBody } from "../../shared/types/domain.types.js";

export async function getPreferencesService(userId: EntityId): Promise<DatabaseRow | null> {
    return await createDefaultUserPreferences(userId);
}

export async function updatePreferencesService(userId: EntityId, data: RequestBody): Promise<DatabaseRow> {
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

export async function updatePreferencesWithWallpaperService(
    userId: EntityId,
    data: RequestBody,
    file?: Express.Multer.File
): Promise<DatabaseRow> {
    const currentPreferences = await createDefaultUserPreferences(userId);
    const wallpaperData = getPreferenceWallpaperData(file);
    const shouldRemoveWallpaper = data.chatWallpaperName === "" && data.chatWallpaperUrl === "";
    let savedPreferences;

    try {
        const preferences = validatePreferences({
            ...currentPreferences,
            ...data,
            ...(wallpaperData ?? {})
        });

        savedPreferences = await updateUserPreferences({
            userId,
            ...preferences
        });
    } catch (error) {
        await deletePreferenceWallpaper(wallpaperData?.chatWallpaperUrl);

        throw error;
    }

    if (
        currentPreferences
        && (wallpaperData || shouldRemoveWallpaper)
        && currentPreferences.chatWallpaperUrl !== savedPreferences.chatWallpaperUrl
    ) {
        await deletePreferenceWallpaper(String(currentPreferences.chatWallpaperUrl ?? ""));
    }

    return savedPreferences;
}

export async function updatePreferenceWallpaperService(
    userId: EntityId,
    file?: Express.Multer.File
): Promise<DatabaseRow> {
    if (!file) {
        throw new BadRequestError("Wallpaper is required");
    }

    return await updatePreferencesWithWallpaperService(userId, {}, file);
}
