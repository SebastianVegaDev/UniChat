import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getCoursesService } from "./courses.service.js";

export const getCourses = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const courses = await getCoursesService(userId);
    
    res.json(courses)
});