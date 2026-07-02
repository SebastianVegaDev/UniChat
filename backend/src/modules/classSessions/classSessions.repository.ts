import { pool } from "../../config/db.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function findAllClassSessions(userId: EntityId): Promise<DatabaseRow[]> {
    const { rows } = await pool.query<DatabaseRow>(`
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
            class_sessions.id,
            class_sessions.course_id AS "courseId",
            class_sessions.classroom_id AS "classroomId",
            class_sessions.topic AS "topic",
            class_sessions.starts_at AS "startsAt",
            class_sessions.ends_at AS "endsAt",
            CASE
                WHEN NOW() BETWEEN starts_at AND ends_at THEN 'now'
                WHEN starts_at > NOW() THEN 'upcoming'
                ELSE 'completed'
            END AS status
        FROM class_sessions
        WHERE class_sessions.course_id IN(
            SELECT course_id
            FROM user_courses
        )
        ORDER BY class_sessions.starts_at;
    `, [userId]);

    return rows;
}
