import { findCourseStats } from "./courseStats.repository.js";

export async function getCourseStatsService(userId) {
    return await findCourseStats(userId);
}
