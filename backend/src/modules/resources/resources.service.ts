import { findAllResources } from "./resources.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getResourcesService(userId: EntityId): Promise<DatabaseRow[]> {
    return await findAllResources(userId);
}
