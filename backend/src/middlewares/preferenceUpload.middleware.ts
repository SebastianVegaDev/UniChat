import { createUploadMiddleware, createUserScopedFileName } from "../shared/uploads/createUploadMiddleware.js";
import { IMAGE_EXTENSIONS, IMAGE_MIME_TYPES, UPLOAD_DIRECTORIES, UPLOAD_SIZE_LIMITS } from "../shared/uploads/upload.constants.js";

export const uploadPreferenceWallpaper = createUploadMiddleware({
    directory: UPLOAD_DIRECTORIES.preferenceWallpapers,
    fieldName: "file",
    maxFileSizeBytes: UPLOAD_SIZE_LIMITS.preferenceWallpaper,
    allowedMimeTypes: IMAGE_MIME_TYPES,
    allowedExtensions: IMAGE_EXTENSIONS,
    invalidTypeMessage: "Invalid wallpaper type",
    makeFileName: createUserScopedFileName("user")
});