import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { BadRequestError } from "../errors/index.js";

const uploadDir = path.resolve("uploads/resources");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const safeOriginalName = file.originalname
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9.-]/g, "");

        const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeOriginalName}`;

        cb(null, uniqueName);
    }
});

const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const allowedExtensions = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".mp4",
    ".ppt",
    ".pptx",
    ".doc",
    ".docx",
    ".sql"
];

function fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.includes(extension)) {
        return cb(new BadRequestError("Invalid file type"));
    }

    cb(null, true);
}

export const uploadTeacherResourceFile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
}).single("file");
