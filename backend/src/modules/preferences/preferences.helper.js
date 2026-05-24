import path from "node:path";
import fs from "node:fs/promises";

export function getPreferenceWallpaperData(file) {
    if (!file) return null;

    return {
        chatWallpaperName: file.originalname,
        chatWallpaperUrl: `/uploads/preferences/${file.filename}`
    };
}

export async function deletePreferenceWallpaper(fileUrl) {
    if (!fileUrl?.startsWith("/uploads/preferences/")) return;

    const filePath = path.resolve(`.${fileUrl}`);

    await fs.unlink(filePath).catch(() => null);
}
