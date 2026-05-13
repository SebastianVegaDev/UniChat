import { pool } from "../../config/db.js";

export async function findAllCourseMembers(userId) {
    const { rows } = await pool.query(`
        WITH user_courses AS(
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
            course_members.course_id AS "courseId",
            course_members.course_role AS "role",
            course_members.user_id AS "userId"
        FROM course_members
        WHERE course_id IN (
            SELECT course_id
            FROM user_courses
        )
            AND course_members.status = 'active'
        ORDER BY course_members.course_id ASC;
    `, [userId]);

    return rows;
}