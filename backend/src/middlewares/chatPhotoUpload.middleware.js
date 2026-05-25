import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { BadRequestError } from "../errors/index.js";

const uploadDir = path.resolve("uploads/chat");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const userId = req.user?.id ?? "user";
        const uniqueName = `chat-${userId}-${Date.now()}-${crypto.randomUUID()}${extension}`;

        cb(null, uniqueName);
    }
});

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

function fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(extension)) {
        return cb(new BadRequestError("Only photos are allowed"));
    }

    cb(null, true);
}

export const uploadChatPhoto = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 8 * 1024 * 1024
    }
}).single("photo");
