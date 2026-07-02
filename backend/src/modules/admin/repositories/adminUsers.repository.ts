import { pool } from "../../../config/db.js";
import type { AdminCourseUserInput, AdminRow, AdminUserBlockInput } from "../types/admin.types.js";

export async function updateAdminUserBlockedStatus({
    userId,
    isBlocked
}: AdminUserBlockInput): Promise<AdminRow | null> {
    const { rows } = await pool.query<AdminRow>(`
        UPDATE users
        SET is_blocked = $2
        WHERE id = $1
        RETURNING
            id,
            code,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            role,
            is_blocked AS "isBlocked",
            avatar_url AS "avatarUrl",
            created_at AS "createdAt";
    `, [userId, isBlocked]);

    return rows[0] ?? null;
}

export async function addAdminCourseUserByCode({ courseId, code }: AdminCourseUserInput): Promise<AdminRow | null> {
    const { rows } = await pool.query<AdminRow>(`
        WITH selected_user AS (
            SELECT id
            FROM users
            WHERE code = $2
        )
        INSERT INTO course_members (
            course_id,
            user_id,
            course_role,
            status
        )
        SELECT
            $1,
            selected_user.id,
            'student',
            'active'
        FROM selected_user
        ON CONFLICT (course_id, user_id) DO UPDATE
        SET course_role = 'student',
            status = 'active'
        RETURNING
            id,
            course_id AS "courseId",
            course_role AS "courseRole",
            user_id AS "userId",
            status,
            joined_at AS "joinedAt";
    `, [courseId, code]);

    return rows[0] ?? null;
}
