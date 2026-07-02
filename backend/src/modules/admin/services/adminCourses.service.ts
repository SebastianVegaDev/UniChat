import { NotFoundError } from "../../../errors/index.js";
import {
    createAdminCourse,
    deleteAdminCourse,
    updateAdminCourse
} from "../repositories/adminCourses.repository.js";
import type { EntityId } from "../../../shared/types/domain.types.js";
import type { AdminCourseInput, AdminCourseSettingsInput, AdminRow } from "../types/admin.types.js";

export async function createAdminCourseService(data: AdminCourseInput): Promise<AdminRow> {
    return await createAdminCourse(data);
}

export async function updateAdminCourseService(
    courseId: EntityId,
    data: AdminCourseSettingsInput
): Promise<AdminRow> {
    const course = await updateAdminCourse(courseId, data);

    if (!course) {
        throw new NotFoundError("Course not found");
    }

    return course;
}

export async function deleteAdminCourseService(courseId: EntityId): Promise<AdminRow> {
    const course = await deleteAdminCourse(courseId);

    if (!course) {
        throw new NotFoundError("Course not found");
    }

    return course;
}
