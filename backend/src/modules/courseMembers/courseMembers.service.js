import { findAllCourseMembers } from "./courseMembers.repository.js";

export async function getCourseMembersService() {
    return await findAllCourseMembers();
}