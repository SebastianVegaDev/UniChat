import { getCourseStatsService } from "./courseStats.service.js";

export async function getCourseStats(req, res, next) {
    try {
        const userId = req.user.id;

        const courseStats = await getCourseStatsService(userId);

        res.json(courseStats)
    } catch (error) {
        next(error)
    }
}
