import { getcourseStatsService } from "./courseStats.service.js";

export async function getcourseStats(req, res, next) {
    try {
        const userId = req.user.id;

        const courseStats = await getcourseStatsService(userId);

        res.json(courseStats)
    } catch (error) {
        next(error)
    }
}