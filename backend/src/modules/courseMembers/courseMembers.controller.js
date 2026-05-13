import { getCourseMembersService } from "./courseMembers.service.js";

const userId = 1;

export async function getCourseMembers(req, res, next) {
    try {
        const courseMembers = await getCourseMembersService(userId);

        res.json(courseMembers)
    } catch (error) {
        next(error);
    }
}