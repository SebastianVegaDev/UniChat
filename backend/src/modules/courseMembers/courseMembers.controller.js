import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getCourseMembersService } from "./courseMembers.service.js";

export const getCourseMemberss = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const courseMembers = await getCourseMembersService(userId);

    res.json(courseMembers)
});