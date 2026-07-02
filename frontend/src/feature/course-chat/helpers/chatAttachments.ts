import { getApiAssetUrl } from "../../../shared/api/config.js";

export function isImageFile(file) {
    return file?.type?.startsWith("image/");
}

export function getMessagePhotoUrl(message) {
    if (message.isDeleted) return "";
    if (message.attachmentType !== "photo") return "";

    return getApiAssetUrl(message.attachmentUrl);
}

export function createPhotoPreviewUrl(file) {
    if (!file) return "";

    return URL.createObjectURL(file);
}

export function revokePhotoPreviewUrl(photoPreviewUrl) {
    if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
    }
}