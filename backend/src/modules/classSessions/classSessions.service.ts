import { findAllClassSessions } from "./classSessions.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getClassSessionsService(userId: EntityId): Promise<DatabaseRow[]> {
    return await findAllClassSessions(userId);
}
