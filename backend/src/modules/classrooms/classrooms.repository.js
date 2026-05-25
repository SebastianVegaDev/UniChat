import { pool } from "../../config/db.js";

export async function findAllClasrooms(userId) {
    const { rows } = await pool.query(`
        WITH auth_user AS (
            SELECT role
            FROM users
            WHERE id = $1
        ),
        user_courses AS (
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
            classrooms.id,
            classrooms.name,
            classrooms.type
        FROM classrooms
        WHERE EXISTS (
                SELECT 1
                FROM auth_user
                WHERE role = 'admin'
            )
            OR id IN(
                SELECT classroom_id
                FROM courses
                WHERE id IN (
                    SELECT course_id
                    FROM user_courses
                )
        )
        ORDER BY classrooms.name ASC;
    `, [userId]);

    return rows;
}
