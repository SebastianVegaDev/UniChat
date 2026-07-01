import { pool } from "../../../config/db.js";

export async function createAdminAnnouncement({ title, body, category, status, authorId }) {
    const { rows } = await pool.query(`
        INSERT INTO announcements (
            title,
            body,
            category,
            status,
            author_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            title,
            body,
            category,
            author_id AS "authorId",
            published_at AS "publishedAt",
            status;
    `, [title, body, category, status, authorId]);

    return rows[0];
}

export async function updateAdminAnnouncement(announcementId, data) {
    const { title, body, category, status } = data;

    const { rows } = await pool.query(`
        UPDATE announcements
        SET title = $2,
            body = $3,
            category = $4,
            status = $5,
            published_at = CASE
                WHEN $5 = 'published' THEN NOW()
                ELSE published_at
            END
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING
            id,
            title,
            body,
            category,
            author_id AS "authorId",
            published_at AS "publishedAt",
            status;
    `, [announcementId, title, body, category, status]);

    return rows[0] ?? null;
}

export async function updateAdminAnnouncementStatus(announcementId, status) {
    const { rows } = await pool.query(`
        UPDATE announcements
        SET status = $2,
            published_at = CASE
                WHEN $2 = 'published' THEN NOW()
                ELSE published_at
            END
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING
            id,
            title,
            body,
            category,
            author_id AS "authorId",
            published_at AS "publishedAt",
            status;
    `, [announcementId, status]);

    return rows[0] ?? null;
}

export async function deleteAdminAnnouncement(announcementId) {
    const { rows } = await pool.query(`
        UPDATE announcements
        SET is_deleted = TRUE,
            status = 'archived'
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING id;
    `, [announcementId]);

    return rows[0] ?? null;
}