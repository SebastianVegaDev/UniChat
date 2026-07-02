import { UPLOAD_PUBLIC_PATHS } from "../../shared/files/uploadPaths.js";
import { deleteUploadFileByUrl, getUploadedFileUrl } from "../../shared/files/uploadedFileStorage.js";
import type { Express } from "express";
import type { PreferenceWallpaperData } from "./types/preferences.types.js";

export function getPreferenceWallpaperData(file?: Express.Multer.File): PreferenceWallpaperData | null {
    if (!file) return null;

    return {
        chatWallpaperName: file.originalname,
        chatWallpaperUrl: getUploadedFileUrl(file, UPLOAD_PUBLIC_PATHS.preferenceWallpapers)
    };
}

export async function deletePreferenceWallpaper(fileUrl: string | null | undefined): Promise<void> {
    await deleteUploadFileByUrl(fileUrl, UPLOAD_PUBLIC_PATHS.preferenceWallpapers);
}
