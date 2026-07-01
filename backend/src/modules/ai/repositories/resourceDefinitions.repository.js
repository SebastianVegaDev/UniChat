import { pool } from "../../../config/db.js";

export async function saveResourceDefinition({ resourceId, definition, model }) {
    const { rows } = await pool.query(`
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