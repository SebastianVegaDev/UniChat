import { getNow, isSameId, updateCourseStats } from "./bootstrapUpdater.utils.js";

function countResourceFolders(resources, courseId) {
    const weekNumbers = resources
        .filter((resource) => isSameId(resource.courseId, courseId))
        .map((resource) => resource.weekNumber);

    return new Set(weekNumbers).size;
}

export function updateResourceStatus(data, resourceId, status) {
    return {
        ...data,
        resources: (data.resources ?? []).map((resource) => {
            if (!isSameId(resource.id, resourceId)) return resource;

            return {
                ...resource,
                status
            };
        })
    };
}

export function removeResource(data, resourceId) {
    const resource = (data.resources ?? []).find((resource) => {
        return isSameId(resource.id, resourceId);
    });

    const nextData = {
        ...data,
        resources: (data.resources ?? []).filter((resource) => {
            return !isSameId(resource.id, resourceId);
        })
    };

    if (!resource) return nextData;

    return updateCourseStats(nextData, resource.courseId, (stat) => ({
        ...stat,
        foldersCount: countResourceFolders(nextData.resources ?? [], resource.courseId),
        lastActivityAt: getNow()
    }));
}

export function addResource(data, resource) {
    const nextData = {
        ...data,
        resources: [
            ...(data.resources ?? []),
            resource
        ]
    };

    return updateCourseStats(nextData, resource.courseId, (stat) => ({
        ...stat,
        foldersCount: countResourceFolders(nextData.resources ?? [], resource.courseId),
        lastActivityAt: getNow()
    }));
}

export function editResource(data, editedResource) {
    const resourceId = editedResource.id ?? editedResource.resourceId;
    const oldResource = (data.resources ?? []).find((resource) => {
        return isSameId(resource.id, resourceId);
    });

    const nextData = {
        ...data,
        resources: (data.resources ?? []).map((resource) => {
            if (!isSameId(resource.id, resourceId)) return resource;

            return {
                ...resource,
                ...editedResource
            };
        })
    };

    return updateCourseStats(nextData, oldResource?.courseId, (stat) => ({
        ...stat,
        foldersCount: countResourceFolders(nextData.resources ?? [], oldResource?.courseId),
        lastActivityAt: getNow()
    }));
}
