import { getCourseMembersService } from "./courseMembers.service.js";

export async function getCourseMembers(req, res, next) {
    try {
        const userId = req.user.id;

        const courseMembers = await getCourseMembersService(userId);

        res.json(courseMembers)
    } catch (error) {
        next(error);
    }
}