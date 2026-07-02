import { pool } from "../../../config/db.js";
import type { EntityId } from "../../../shared/types/domain.types.js";
import type { ResourceDefinition } from "../types/ai.types.js";

interface SaveResourceDefinitionInput {
    resourceId: EntityId;
    definition: string;
    model: string;
}

export async function saveResourceDefinition({
    resourceId,
    definition,
    model
}: SaveResourceDefinitionInput): Promise<ResourceDefinition | null> {
    const { rows } = await pool.query<ResourceDefinition>(`
        INSERT INTO resource_definitions (
            resource_id,
            definition,
            model
        )
        VALUES ($1, $2, $3)
        ON CONFLICT (resource_id) DO UPDATE
        SET definition = EXCLUDED.definition,
            model = EXCLUDED.model,
            updated_at = NOW()
        RETURNING
            resource_id AS "resourceId",
            definition,
            model;
    `, [resourceId, definition, model]);

    return rows[0] ?? null;
}
