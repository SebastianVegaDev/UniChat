import { pool } from "../../config/db.js";

export async function findAllCalendarEvents(userId) {
    const { rows } = await pool.query(`
        WITH auth_user AS (
            SELECT role
            FROM users
            WHERE id = $1
        ),
        user_courses AS(
            SELECT id AS course_id
            FROM courses
            WHERE EXISTS (
                SELECT 1
                FROM auth_user
                WHERE role = 'admin'
            )
            UNION
            SELECT course_id
            FROM course_members
            WHERE user_id = $1
                AND status = 'active'
            UNION
            SELECT id AS course_id
            FROM courses
            WHERE teacher_id = $1
        )
        
        SELECT
            calendar_events.id,
            calendar_events.course_id AS "courseId",
            calendar_events.title,
            calendar_events.description,
            calendar_events.event_type AS "eventType",
            calendar_events.starts_at AS "startsAt",
            calendar_events.ends_at AS "endsAt",
            CASE
                WHEN calendar_events.is_cancelled = TRUE THEN 'cancelled'
                WHEN NOW() < calendar_events.starts_at THEN 'pending'
                WHEN calendar_events.ends_at IS NULL THEN 'completed'
                WHEN NOW() > calendar_events.ends_at THEN 'completed'
                WHEN NOW() BETWEEN calendar_events.starts_at AND calendar_events.ends_at THEN 'scheduled'
            END AS "status"
        FROM calendar_events
        WHERE calendar_events.course_id IN(
            SELECT course_id
            FROM user_courses
        )
            AND calendar_events.is_deleted = FALSE
        ORDER BY calendar_events.starts_at;
    `, [userId]);

    return rows;
}
