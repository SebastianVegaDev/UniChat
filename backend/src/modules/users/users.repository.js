import { pool } from "../../config/db.js";

export async function findRelatedUsersByUserId(userId) {
    const { rows } = await pool.query(`
        WITH auth_user AS (
            SELECT role
            FROM users
            WHERE id = $1
        ),
        user_courses AS (
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
            users.id,
            users.code,
            users.first_name AS "firstName",
            users.last_name AS "lastName",
            users.email,
            users.role,
            users.is_blocked AS "isBlocked",
            users.avatar_url AS "avatarUrl",
            users.created_at AS "createdAt"
        FROM users
        WHERE EXISTS (
                SELECT 1
                FROM auth_user
                WHERE role = 'admin'
            )
            OR users.id = $1
            OR users.id IN (
                SELECT courses.teacher_id
                FROM courses
                WHERE courses.id IN (SELECT course_id FROM user_courses)
            )
            OR users.id IN (
                SELECT course_members.user_id
                FROM course_members
                WHERE course_members.course_id IN (SELECT course_id FROM user_courses)
                    AND course_members.status = 'active'
            )
            OR users.id IN (
                SELECT course_members.user_id
                FROM course_members
                INNER JOIN courses
                    ON courses.id = course_members.course_id
                WHERE courses.teacher_id = $1
            )
        ORDER BY users.first_name ASC, users.last_name ASC;
    `, [userId]);

    return rows;
}

export async function findUserById(userId) {
    const { rows } = await pool.query(`
        SELECT
            id,
            code,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            role,
            is_blocked AS "isBlocked",
            avatar_url AS "avatarUrl",
            created_at AS "createdAt"
        FROM users
        WHERE id = $1;
    `, [userId]);

    return rows[0] ?? null;
}
