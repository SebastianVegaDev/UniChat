import {
    insertTeacherResource,
    softDeleteTeacherResource,
    toggleTeacherResourceAvailability,
    updateTeacherResource
} from "./teacherResources.repository.js"
import { BadRequestError, NotFoundError } from "../../../errors/index.js";

export async function deleteTeacherResourceService(resourceId) {
    if (!resourceId) {
        throw new BadRequestError("Resource id is required");
    }

    const resource = await softDeleteTeacherResource({resourceId});

    if (!resource) {
        throw new NotFoundError("Resource not found");
    }

    return resource;
}

export async function editTeacherResourceService(data) {
    const {
        resourceId,
        weekNumber,
        title,
        kind,
        sizeBytes,
        fileUrl,
        status
    } = data

    if (!resourceId) {
        throw new BadRequestError("Resource id is required");
    }

    if (!weekNumber || !title || !kind || !fileUrl || !status) {
        throw new BadRequestError("Resource data is required");
    }

    const resource = await updateTeacherResource({
        resourceId,
        weekNumber,
        title,
        kind,
        sizeBytes,
        fileUrl,
        status
    });

    if (!resource) {
        throw new NotFoundError("Resource not found");
    }

    return resource;
}

export async function toggleTeacherResourceService({status, resourceId}) {
    if (!resourceId) {
        throw new BadRequestError("Resource id is required");
    }

    if (!status) {
        throw new BadRequestError("Resource status is required");
    }

    const resource = await toggleTeacherResourceAvailability({status, resourceId});

    if (!resource) {
        throw new NotFoundError("Resource not found");
    }

    return resource;
}

export async function uploadTeacherResourceService(data) {
    const {
        courseId,
        weekNumber, 
        title, 
        kind, 
        sizeBytes, 
        uploadedById,
        fileUrl,
        status
    } = data

    if (!courseId || !weekNumber || !title || !kind || !fileUrl || !status) {
        throw new BadRequestError("Resource data is required");
    }

    return await insertTeacherResource({
        courseId,
        weekNumber, 
        title, 
        kind, 
        sizeBytes, 
        uploadedById,
        fileUrl,
        status
    });
}
