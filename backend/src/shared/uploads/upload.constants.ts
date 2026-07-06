export const UPLOAD_DIRECTORIES = {
    chatPhotos: "uploads/chat",
    preferenceWallpapers: "uploads/preferences",
    resources: "uploads/resources"
} as const;

export const UPLOAD_SIZE_LIMITS = {
    chatPhoto: 5 * 1024 * 1024,
    preferenceWallpaper: 8 * 1024 * 1024,
    resourceFile: 50 * 1024 * 1024
} as const;

export const IMAGE_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
]);

export const IMAGE_EXTENSIONS = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif"
]);

export const RESOURCE_MIME_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/sql",
    "application/x-sql",
    "text/plain",
    "text/markdown",
    "text/csv",
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime"
]);

export const RESOURCE_EXTENSIONS = new Set([
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".sql",
    ".txt",
    ".md",
    ".csv",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".mp4",
    ".webm",
    ".mov"
]);
