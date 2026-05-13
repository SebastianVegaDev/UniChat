import { pool } from "../../config/db.js";

export async function findAllCourses(userId) {
    const { rows } = await pool.query(`
        WITH user_courses AS (
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
            courses.id,
            courses.short_name AS "shortName",
            courses.title,
            courses.slug,
            courses.teacher_id AS "teacherId",
            courses.classroom_id AS "classroomId",
            courses.current_week AS "currentWeek"
        FROM courses
        WHERE courses.id IN(
            SELECT course_id
            FROM user_courses
        )
        ORDER BY courses.title ASC;
    `, [userId]);

    return rows;
}
