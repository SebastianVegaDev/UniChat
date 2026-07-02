import { findRelatedUsersByUserId, findUserById } from "./users.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getUsersService(userId: EntityId): Promise<DatabaseRow[]> {
    return await findRelatedUsersByUserId(userId);
}

export async function getCurrentUserService(userId: EntityId): Promise<DatabaseRow | null> {
    return await findUserById(userId);
}
