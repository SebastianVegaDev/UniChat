import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import multer from "multer";
import { BadRequestError } from "../../errors/index.js";
import type { Request } from "express";

type ValidationMode = "both" | "either";

type FileNameFactory = (req: Request, file: Express.Multer.File) => string;

type UploadMiddlewareOptions = {
    directory: string;
    fieldName: string;
    maxFileSizeBytes: number;
    allowedMimeTypes: ReadonlySet<string>;
    allowedExtensions: ReadonlySet<string>;
    invalidTypeMessage: string;
    makeFileName: FileNameFactory;
    validationMode?: ValidationMode;
};

function sanitizeBaseName(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[^\w.-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 120) || "file";
}

function getSafeExtension(file: Express.Multer.File): string {
    return path.extname(file.originalname).toLowerCase();
}

function hasAllowedType(
    file: Express.Multer.File,
    allowedMimeTypes: ReadonlySet<string>,
    allowedExtensions: ReadonlySet<string>,
    validationMode: ValidationMode
): boolean {
    const hasMimeType = allowedMimeTypes.has(file.mimetype);
    const hasExtension = allowedExtensions.has(getSafeExtension(file));

    return validationMode === "either"
        ? hasMimeType || hasExtension
        : hasMimeType && hasExtension;
}

export function createUserScopedFileName(prefix: string): FileNameFactory {
    return (req, file) => {
        const userId = req.user?.id ?? "anonymous";
        const extension = getSafeExtension(file);
        const uniquePart = crypto.randomUUID();

        return `${sanitizeBaseName(prefix)}-${userId}-${uniquePart}${extension}`;
    };
}

export function createOriginalNameFileName(): FileNameFactory {
    return (_req, file) => {
        const extension = getSafeExtension(file);
        const originalBaseName = path.basename(file.originalname, extension);
        const uniquePart = crypto.randomUUID();

        return `${sanitizeBaseName(originalBaseName)}-${uniquePart}${extension}`;
    };
}

export function createUploadMiddleware(options: UploadMiddlewareOptions) {
    const storage = multer.diskStorage({
        destination: (_req, _file, callback) => {
            fs.mkdir(options.directory, { recursive: true })
                .then(() => callback(null, options.directory))
                .catch((error: unknown) => callback(error as Error, options.directory));
        },
        filename: (req, file, callback) => {
            callback(null, options.makeFileName(req, file));
        }
    });

    const upload = multer({
        storage,
        limits: {
            fileSize: options.maxFileSizeBytes
        },
        fileFilter: (_req, file, callback) => {
            const validationMode = options.validationMode ?? "both";

            if (
                !hasAllowedType(
                    file,
                    options.allowedMimeTypes,
                    options.allowedExtensions,
                    validationMode
                )
            ) {
                callback(new BadRequestError(options.invalidTypeMessage));
                return;
            }

            callback(null, true);
        }
    });

    return upload.single(options.fieldName);
}
