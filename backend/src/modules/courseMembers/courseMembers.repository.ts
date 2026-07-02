import { pool } from "../../config/db.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function findAllCourseMembers(userId: EntityId): Promise<DatabaseRow[]> {
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
            course_members.id,
            course_members.course_id AS "courseId",
            course_members.course_role AS "courseRole",
            course_members.user_id AS "userId",
            course_members.status,
            course_members.joined_at AS "joinedAt"
        FROM course_members
        WHERE course_id IN (
            SELECT course_id
            FROM user_courses
        )
            AND (
                course_members.status = 'active'
                OR course_members.course_id IN (
                    SELECT id
                    FROM courses
                    WHERE teacher_id = $1
                )
                OR EXISTS (
                    SELECT 1
                    FROM auth_user
                    WHERE role = 'admin'
                )
            )
        ORDER BY course_members.course_id ASC;
    `, [userId]);

    return rows;
}
