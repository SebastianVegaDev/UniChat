import { findCourseStats } from "./courseStats.repository.js";

export async function getcourseStatsService(userId) {
    return await findCourseStats(userId);
}