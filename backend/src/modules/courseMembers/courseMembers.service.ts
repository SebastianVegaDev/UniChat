import { findAllCourseMembers } from "./courseMembers.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getCourseMembersService(userId: EntityId): Promise<DatabaseRow[]> {
    return await findAllCourseMembers(userId);
}
