import { findAllCourseMembers } from "./courseMembers.repository.js";

export async function getCourseMembers() {
    return await findAllCourseMembers;
}