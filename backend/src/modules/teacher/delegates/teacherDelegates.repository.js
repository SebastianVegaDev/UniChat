import { pool } from "../../../config/db.js";

export async function findUserByCode(code) {
    const { rows } = await pool.query(`
        SELECT
            id,
            code,
            is_blocked AS "isBlocked"
        FROM users
        WHERE code = $1;
    `, [code]);

    return rows[0] ?? null;
}

export async function findCourseMember({ courseId, userId }) {
    const { rows } = await pool.query(`
        SELECT
            id,
            course_id AS "courseId",
            course_role AS "courseRole",
            user_id AS "userId",
            status,
            joined_at AS "joinedAt"
        FROM course_members
        WHERE course_id = $1
            AND user_id = $2;
    `, [courseId, userId]);

    return rows[0] ?? null;
}

export async function countCourseDelegates(courseId) {
    const { rows } = await pool.query(`
        SELECT COUNT(*)::int AS total
        FROM course_members
        WHERE course_id = $1
            AND course_role = 'delegate'
            AND status IN ('active', 'pending_delegate');
    `, [courseId]);

    return rows[0]?.total ?? 0;
}

export async function upsertTeacherDelegateRequest({ courseId, userId }) {
    const { rows } = await pool.query(`
        INSERT INTO course_members (
            course_id,
            user_id,
            course_role,
            status
        )
        VALUES ($1, $2, 'delegate', 'pending_delegate')
        ON CONFLICT (course_id, user_id) DO UPDATE
        SET course_role = 'delegate',
            status = CASE
                WHEN course_members.course_role = 'delegate'
                    AND course_members.status = 'active'
                    THEN 'active'
                ELSE 'pending_delegate'
            END
        RETURNING
            id,
            course_id AS "courseId",
            course_role AS "courseRole",
            user_id AS "userId",
            status,
            joined_at AS "joinedAt";
    `, [courseId, userId]);

    return rows[0] ?? null;
}
