import { getApiAssetUrl } from "../../../shared/api/config.js";

export function isResourceUnavailable(resource) {
    return resource.statusLabel === "unavailable" || resource.status === "unavailable";
}

export function getResourceUrl(resource) {
    return resource.fileUrl || resource.url || "";
}

export function openCourseResource(resource) {
    if (isResourceUnavailable(resource)) return;

    const fileUrl = getResourceUrl(resource);

    if (!fileUrl) return;

    window.open(getApiAssetUrl(fileUrl), "_blank", "noopener,noreferrer");
}

export function formatSelectedFileSize(size) {
    return `${(size / 1000000).toFixed(1)} MB`;
}