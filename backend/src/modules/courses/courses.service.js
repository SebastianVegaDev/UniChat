import { findAllCourses } from "./courses.repository.js";

export async function getCoursesService() {
    return await findAllCourses();
}