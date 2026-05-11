import { findAllCourses } from "./courses.repository.js";

export async function getCourses() {
    return await findAllCourses;
}