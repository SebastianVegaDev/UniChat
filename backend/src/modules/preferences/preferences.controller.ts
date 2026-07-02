import { asyncHandler } from "../../shared/http/asyncHandler.js";
import {
    getPreferencesService,
    updatePreferenceWallpaperService,
    updatePreferencesWithWallpaperService
} from "./preferences.service.js";

export const getPreferences = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const preferences = await getPreferencesService(userId);

    res.json(preferences);
});

export const updatePreferences = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const preferences = await updatePreferencesWithWallpaperService(userId, req.body, req.file);

    res.json(preferences);
});

export const updatePreferenceWallpaper = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const preferences = await updatePreferenceWallpaperService(userId, req.file);

    res.json(preferences);
});
