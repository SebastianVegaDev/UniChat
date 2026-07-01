import { UPLOAD_PUBLIC_PATHS } from "../../shared/files/uploadPaths.js";
import { deleteUploadFileByUrl, getUploadedFileUrl } from "../../shared/files/uploadedFileStorage.js";

export function getPreferenceWallpaperData(file) {
    if (!file) return null;

    return {
        chatWallpaperName: file.originalname,
        chatWallpaperUrl: getUploadedFileUrl(file, UPLOAD_PUBLIC_PATHS.preferenceWallpapers)
    };
}

export async function deletePreferenceWallpaper(fileUrl) {
    await deleteUploadFileByUrl(fileUrl, UPLOAD_PUBLIC_PATHS.preferenceWallpapers);
}