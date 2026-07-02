import { findCourseStats } from "./courseStats.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getCourseStatsService(userId: EntityId): Promise<DatabaseRow[]> {
    return await findCourseStats(userId);
}
