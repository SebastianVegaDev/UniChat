import { findAllCourseMembers } from "./courseMembers.repository.js";

export async function getCourseMembersService(userId) {
    return await findAllCourseMembers(userId);
}