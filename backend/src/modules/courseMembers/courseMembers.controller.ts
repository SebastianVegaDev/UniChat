import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getCourseMembersService } from "./courseMembers.service.js";

export const getCourseMembers = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const courseMembers = await getCourseMembersService(userId);

    res.json(courseMembers)
});
