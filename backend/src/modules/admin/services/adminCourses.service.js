import { NotFoundError } from "../../../errors/index.js";
import {
    createAdminCourse,
    deleteAdminCourse,
    updateAdminCourse
} from "../repositories/adminCourses.repository.js";

export async function createAdminCourseService(data) {
    return await createAdminCourse(data);
}

export async function updateAdminCourseService(courseId, data) {
    const course = await updateAdminCourse(courseId, data);

    if (!course) {
        throw new NotFoundError("Course not found");
    }

    return course;
}

export async function deleteAdminCourseService(courseId) {
    const course = await deleteAdminCourse(courseId);

    if (!course) {
        throw new NotFoundError("Course not found");
    }

    return course;
}