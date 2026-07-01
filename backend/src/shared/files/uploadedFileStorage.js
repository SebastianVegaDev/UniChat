import fs from "node:fs/promises";
import path from "node:path";

function normalizePublicDirectory(publicDirectory) {
    return `/${publicDirectory}`
        .replace(/\\/g, "/")
        .replace(/\/+/g, "/")
        .replace(/\/$/, "");
}

function isSafeLocalUploadPath(filePath) {
    const uploadsRoot = path.resolve("uploads");
    const resolvedFilePath = path.resolve(filePath);

    return resolvedFilePath === uploadsRoot || resolvedFilePath.startsWith(`${uploadsRoot}${path.sep}`);
}

export function buildUploadFileUrl(publicDirectory, filename) {
    if (!filename) return null;

    const normalizedDirectory = normalizePublicDirectory(publicDirectory);

    return `${normalizedDirectory}/${filename}`;
}

export function getUploadedFileUrl(file, publicDirectory) {
    if (!file?.filename) return null;

    return buildUploadFileUrl(publicDirectory, file.filename);
}

export async function deleteLocalFile(filePath) {
    if (!filePath || !isSafeLocalUploadPath(filePath)) return;

    await fs.unlink(path.resolve(filePath)).catch(() => null);
}

export async function deleteUploadedFile(file) {
    await deleteLocalFile(file?.path);
}

export async function deleteUploadFileByUrl(fileUrl, allowedPublicDirectory) {
    if (!fileUrl) return;

    const normalizedDirectory = normalizePublicDirectory(allowedPublicDirectory);

    if (!fileUrl.startsWith(`${normalizedDirectory}/`)) return;

    const relativePath = fileUrl.replace(/^\//, "");

    await deleteLocalFile(relativePath);
}