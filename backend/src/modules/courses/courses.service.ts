import { findAllCourses } from "./courses.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getCoursesService(userId: EntityId): Promise<DatabaseRow[]> {
    return await findAllCourses(userId);
}
