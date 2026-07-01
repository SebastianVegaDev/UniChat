import { UPLOAD_PUBLIC_PATHS } from "../../shared/files/uploadPaths.js";
import { getUploadedFileUrl } from "../../shared/files/uploadedFileStorage.js";

export function getChatPhotoData(file) {
    if (!file) return {};

    return {
        attachmentType: "photo",
        attachmentUrl: getUploadedFileUrl(file, UPLOAD_PUBLIC_PATHS.chatPhotos),
        attachmentName: file.originalname
    };
}