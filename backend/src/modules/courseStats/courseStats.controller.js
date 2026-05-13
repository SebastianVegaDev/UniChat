import { getcourseStatsService } from "./courseStats.service.js";

const userId = 1;

export async function getcourseStats(req, res, next) {
    try {
        const courseStats = await getcourseStatsService(userId);

        res.json(courseStats)
    } catch (error) {
        next(error)
    }
}