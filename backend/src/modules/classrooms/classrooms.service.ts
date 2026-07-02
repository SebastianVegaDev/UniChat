import { findAllClasrooms } from "./classrooms.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getClassroomsService(userId: EntityId): Promise<DatabaseRow[]> {
    return await findAllClasrooms(userId);
}
