import {
    insertTeacherResource,
    softDeleteTeacherResource,
    toggleTeacherResourceAvailability,
    updateTeacherResource
} from "./teacherResources.repository.js"
import { NotFoundError } from "../../../errors/index.js";
import { findTeacherCourseAccess, findTeacherResourceAccess } from "../../access/access.repository.js";

export async function deleteTeacherResourceService({teacherId, resourceId}) {
    const access = await findTeacherResourceAccess({
        teacherId,
        resourceId
    });

    if (!access) {
        throw new NotFoundError("Resource not found");
    }

    const resource = await softDeleteTeacherResource({resourceId});

    if (!resource) {
        throw new NotFoundError("Resource not found");
    }

    return resource;
}

export async function editTeacherResourceService(data) {
    const { resourceId, teacherId } = data;

    const access = await findTeacherResourceAccess({
        teacherId,
        resourceId
    });

    if (!access) {
        throw new NotFoundError("Resource not found");
    }

    const resource = await updateTeacherResource(data);

    if (!resource) {
        throw new NotFoundError("Resource not found");
    }

    return resource;
}

export async function toggleTeacherResourceService({status, resourceId, teacherId}) {
    const access = await findTeacherResourceAccess({
        teacherId,
        resourceId
    });

    if (!access) {
        throw new NotFoundError("Resource not found");
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
        uploadedById
    } = data;

    const access = await findTeacherCourseAccess({
        teacherId: uploadedById,
        courseId
    });

    if (!access) {
        throw new NotFoundError("Course not found");
    }

    return await insertTeacherResource(data);
}
