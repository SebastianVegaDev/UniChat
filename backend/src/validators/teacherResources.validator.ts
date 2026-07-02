import {
    validateEnum,
    validateNonNegativeInteger,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";

const RESOURCE_KINDS = ["pdf", "video", "ppt", "photo", "sql", "link", "doc", "other"] as const;
const RESOURCE_STATUS = ["available", "unavailable"] as const;

function validateResourceFields(body: Record<string, unknown> = {}) {
    return {
        weekNumber: validateRequiredId(body.weekNumber, "Week number"),
        title: validateRequiredString(body.title, "Title", 150),
        kind: validateEnum(body.kind, "Kind", RESOURCE_KINDS),
        sizeBytes: validateNonNegativeInteger(body.sizeBytes, "Size bytes"),
        fileUrl: validateRequiredString(body.fileUrl, "File URL", 2048),
        status: validateEnum(body.status, "Status", RESOURCE_STATUS)
    };
}

export function validateUploadTeacherResource(body: Record<string, unknown> = {}) {
    return {
        courseId: validateRequiredId(body.courseId, "Course id"),
        ...validateResourceFields(body)
    };
}

export function validateEditTeacherResource(body: Record<string, unknown> = {}) {
    return {
        resourceId: validateRequiredId(body.resourceId, "Resource id"),
        ...validateResourceFields(body)
    };
}

export function validateToggleTeacherResource(body: Record<string, unknown> = {}) {
    return {
        resourceId: validateRequiredId(body.resourceId, "Resource id"),
        status: validateEnum(body.status, "Status", RESOURCE_STATUS)
    };
}


export function validateDeleteTeacherResource(body: Record<string, unknown> = {}) {
    return {
        resourceId: validateRequiredId(body.resourceId, "Resource id")
    };
}
