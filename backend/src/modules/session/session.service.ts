import { findSession } from "./session.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getSessionService(userId: EntityId): Promise<DatabaseRow | undefined> {
    return await findSession(userId)
}
