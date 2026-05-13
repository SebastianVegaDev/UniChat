import { getCoursesService } from "./courses.service.js";

const userId = 1;

export async function getCourses(req, res, next) {
    try {
        const courses = await getCoursesService(userId);
        
        res.json(courses)
    } catch (error) {
        next(error);
    }
}