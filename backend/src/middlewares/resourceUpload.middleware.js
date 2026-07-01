import { createOriginalNameFileName, createUploadMiddleware } from "../shared/uploads/createUploadMiddleware.js";
import { RESOURCE_EXTENSIONS, RESOURCE_MIME_TYPES, UPLOAD_DIRECTORIES, UPLOAD_SIZE_LIMITS } from "../shared/uploads/upload.constants.js";

export const uploadTeacherResourceFile = createUploadMiddleware({
    directory: UPLOAD_DIRECTORIES.resources,
    fieldName: "file",
    maxFileSizeBytes: UPLOAD_SIZE_LIMITS.resourceFile,
    allowedMimeTypes: RESOURCE_MIME_TYPES,
    allowedExtensions: RESOURCE_EXTENSIONS,
    invalidTypeMessage: "Invalid file type",
    makeFileName: createOriginalNameFileName(),
    validationMode: "either"
});