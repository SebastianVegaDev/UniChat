import { pool } from "../../config/db.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function findAllResources(userId: EntityId): Promise<DatabaseRow[]> {
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
            resources.id,
            resources.course_id AS "courseId",
            resources.week_number AS "weekNumber",
            resources.title,
            resources.kind,
            resources.size_bytes AS "sizeBytes",
            resources.uploaded_by_id AS "uploadedById",
            resources.created_at AS "createdAt",
            resources.file_url AS "url",
            resources.status
        FROM resources
        WHERE resources.course_id IN(
            SELECT course_id
            FROM user_courses
        )
            AND resources.is_deleted = FALSE
        ORDER BY resources.course_id
    `, [userId]);

    return rows;
}
