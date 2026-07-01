import { UPLOAD_PUBLIC_PATHS } from "../../../shared/files/uploadPaths.js";
import { deleteUploadFileByUrl, getUploadedFileUrl } from "../../../shared/files/uploadedFileStorage.js";

export async function deleteResourceFile(fileUrl) {
    await deleteUploadFileByUrl(fileUrl, UPLOAD_PUBLIC_PATHS.resources);
}

export function getResourceFileData(file) {
    if (!file) return null;

    return {
        kind: getResourceKind(file),
        sizeBytes: file.size,
        fileUrl: getUploadedFileUrl(file, UPLOAD_PUBLIC_PATHS.resources)
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