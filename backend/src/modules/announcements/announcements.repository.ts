import { pool } from "../../config/db.js";
import type { DatabaseRow } from "../../shared/types/domain.types.js";

export async function findAllAnnouncements(): Promise<DatabaseRow[]> {
    const { rows } = await pool.query<DatabaseRow>(`
        SELECT
            announcements.id,
            announcements.title,
            announcements.body,
            announcements.category,
            announcements.author_id AS "authorId",
            announcements.published_at AS "publishedAt",
            announcements.status
        FROM announcements
        WHERE announcements.is_deleted = FALSE
        ORDER BY announcements.published_at DESC;
    `);

    return rows;
}
