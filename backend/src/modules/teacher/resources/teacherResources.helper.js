import path from "node:path";
import fs from "node:fs/promises";

export async function deleteResourceFile(fileUrl) {
    if (!fileUrl?.startsWith("/uploads/resources/")) return;

    const filePath = path.resolve(`.${fileUrl}`);

    await fs.unlink(filePath).catch(() => null);
}

export function getResourceFileData(file) {
    if (!file) return null;

    return {
        kind: getResourceKind(file),
        sizeBytes: file.size,
        fileUrl: `/uploads/resources/${file.filename}`
    };
}

function getResourceKind(file) {
    if (!file) return "other";

    if (file.mimetype === "application/pdf") return "pdf";
    if (file.mimetype.includes("video")) return "video";
    if (file.mimetype.includes("image")) return "photo";

    const extension = file.originalname.split(".").pop().toLowerCase();

    if (extension === "ppt" || extension === "pptx") return "ppt";
    if (extension === "sql") return "sql";
    if (extension === "doc" || extension === "docx") return "doc";

    return "other";
}
