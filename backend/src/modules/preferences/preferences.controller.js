import {
    getPreferencesService,
    updatePreferenceWallpaperService,
    updatePreferencesWithWallpaperService
} from "./preferences.service.js";

export async function getPreferences(req, res, next) {
    try {
        const userId = req.user.id;

        const preferences = await getPreferencesService(userId);

        res.json(preferences);
    } catch (error) {
        next(error);
    }
}

export async function updatePreferences(req, res, next) {
    try {
        const userId = req.user.id;

        const preferences = await updatePreferencesWithWallpaperService(userId, req.body, req.file);

        res.json(preferences);
    } catch (error) {
        next(error);
    }
}

export async function updatePreferenceWallpaper(req, res, next) {
    try {
        const userId = req.user.id;

        const preferences = await updatePreferenceWallpaperService(userId, req.file);

        res.json(preferences);
    } catch (error) {
        next(error);
    }
}
