import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getCourseStatsService } from "./courseStats.service.js";

export const getCourseStats = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const courseStats = await getCourseStatsService(userId);

    res.json(courseStats)
});
