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
