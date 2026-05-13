import { findAllCourses } from "./courses.repository.js";

export async function getCoursesService(userId) {
    return await findAllCourses(userId);
}