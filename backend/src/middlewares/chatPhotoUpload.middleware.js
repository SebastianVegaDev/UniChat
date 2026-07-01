import { createUploadMiddleware, createUserScopedFileName } from "../shared/uploads/createUploadMiddleware.js";
import { IMAGE_EXTENSIONS, IMAGE_MIME_TYPES, UPLOAD_DIRECTORIES, UPLOAD_SIZE_LIMITS } from "../shared/uploads/upload.constants.js";

export const uploadChatPhoto = createUploadMiddleware({
    directory: UPLOAD_DIRECTORIES.chatPhotos,
    fieldName: "photo",
    maxFileSizeBytes: UPLOAD_SIZE_LIMITS.chatPhoto,
    allowedMimeTypes: IMAGE_MIME_TYPES,
    allowedExtensions: IMAGE_EXTENSIONS,
    invalidTypeMessage: "Only photos are allowed",
    makeFileName: createUserScopedFileName("chat")
});