import fs from "node:fs/promises";
import path from "node:path";
import type { Express } from "express";

function normalizePublicDirectory(publicDirectory: string): string {
    return `/${publicDirectory}`
        .replace(/\\/g, "/")
        .replace(/\/+/g, "/")
        .replace(/\/$/, "");
}

function isSafeLocalUploadPath(filePath: string): boolean {
    const uploadsRoot = path.resolve("uploads");
    const resolvedFilePath = path.resolve(filePath);

    return resolvedFilePath === uploadsRoot || resolvedFilePath.startsWith(`${uploadsRoot}${path.sep}`);
}

export function buildUploadFileUrl(publicDirectory: string, filename?: string | null): string | null {
    if (!filename) return null;

    const normalizedDirectory = normalizePublicDirectory(publicDirectory);

    return `${normalizedDirectory}/${filename}`;
}

export function getUploadedFileUrl(file: Express.Multer.File | undefined, publicDirectory: string): string | null {
    if (!file?.filename) return null;

    return buildUploadFileUrl(publicDirectory, file.filename);
}

export async function deleteLocalFile(filePath?: string | null): Promise<void> {
    if (!filePath || !isSafeLocalUploadPath(filePath)) return;

    await fs.unlink(path.resolve(filePath)).catch(() => null);
}

export async function deleteUploadedFile(file?: Express.Multer.File | null): Promise<void> {
    await deleteLocalFile(file?.path);
}

export async function deleteUploadFileByUrl(
    fileUrl: string | null | undefined,
    allowedPublicDirectory: string
): Promise<void> {
    if (!fileUrl) return;

    const normalizedDirectory = normalizePublicDirectory(allowedPublicDirectory);

    if (!fileUrl.startsWith(`${normalizedDirectory}/`)) return;

    const relativePath = fileUrl.replace(/^\//, "");

    await deleteLocalFile(relativePath);
}
