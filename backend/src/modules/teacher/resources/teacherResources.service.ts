import {
    findTeacherResourceById,
    insertTeacherResource,
    softDeleteTeacherResource,
    toggleTeacherResourceAvailability,
    updateTeacherResource
} from "./teacherResources.repository.js"
import { NotFoundError } from "../../../errors/index.js";
import { findTeacherCourseAccess, findTeacherResourceAccess } from "../../access/access.repository.js";
import { deleteResourceFile } from "./teacherResources.helper.js";
import type {
    TeacherResourceEditInput,
    TeacherResourceIdentity,
    TeacherResourceInput,
    TeacherRow
} from "../types/teacher.types.js";

export async function deleteTeacherResourceService({
    teacherId,
    resourceId
}: Required<TeacherResourceIdentity>): Promise<TeacherRow> {
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

export async function editTeacherResourceService(data: TeacherResourceEditInput): Promise<TeacherRow> {
    const { resourceId, teacherId } = data;

    const access = await findTeacherResourceAccess({
        teacherId,
        resourceId
    });

    if (!access) {
        throw new NotFoundError("Resource not found");
    }

    const oldResource = await findTeacherResourceById({ resourceId });

    const resource = await updateTeacherResource(data);

    if (!resource) {
        throw new NotFoundError("Resource not found");
    }

    if (oldResource && oldResource.fileUrl !== resource.fileUrl) {
        await deleteResourceFile(String(oldResource.fileUrl));
    }

    return resource;
}

export async function toggleTeacherResourceService({
    status,
    resourceId,
    teacherId
}: Pick<TeacherResourceEditInput, "status" | "resourceId" | "teacherId">): Promise<TeacherRow> {
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

export async function uploadTeacherResourceService(data: TeacherResourceInput): Promise<TeacherRow> {
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
