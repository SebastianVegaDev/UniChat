import { UPLOAD_PUBLIC_PATHS } from "../../shared/files/uploadPaths.js";
import { getUploadedFileUrl } from "../../shared/files/uploadedFileStorage.js";
import type { Express } from "express";
import type { ChatPhotoData } from "./types/chat.types.js";

export function getChatPhotoData(file?: Express.Multer.File): ChatPhotoData {
    if (!file) return {};

    return {
        attachmentType: "photo",
        attachmentUrl: getUploadedFileUrl(file, UPLOAD_PUBLIC_PATHS.chatPhotos),
        attachmentName: file.originalname
    };
}
