import { getCoursesService } from "./courses.service.js";

export async function getCourses(req, res, next) {
    try {
        const userId = req.user.id;

        const courses = await getCoursesService(userId);
        
        res.json(courses)
    } catch (error) {
        next(error);
    }
}