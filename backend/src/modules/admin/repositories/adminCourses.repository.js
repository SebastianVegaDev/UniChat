import { pool } from "../../../config/db.js";

function mapChatChannel(row) {
    return {
        id: row.id,
        courseId: row.courseId,
        name: row.name,
        description: row.description,
        type: row.type,
        isLocked: row.isLocked
    };
}

export async function createAdminCourse(data) {
    const { shortName, title, slug, teacherId, classroomId, secondaryClassroomId, currentWeek } = data;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const { rows } = await client.query(`
            INSERT INTO courses (
                short_name,
                title,
                slug,
                teacher_id,
                classroom_id,
                secondary_classroom_id,
                current_week
            )
            VALUES ($1, $2, $3, $4, NULLIF($5, 0), NULLIF($6, 0), $7)
            RETURNING
                id,
                short_name AS "shortName",
                title,
                slug,
                teacher_id AS "teacherId",
                classroom_id AS "classroomId",
                secondary_classroom_id AS "secondaryClassroomId",
                current_week AS "currentWeek";
        `, [shortName, title, slug, teacherId, classroomId, secondaryClassroomId, currentWeek]);

        const course = rows[0];

        const { rows: channelRows } = await client.query(`
            INSERT INTO chat_channels (
                course_id,
                name,
                description,
                type,
                is_default
            )
            VALUES
                ($1, 'Chat grupal', 'Conversacion general del curso.', 'group', TRUE),
                ($1, 'Anuncios', 'Avisos oficiales del curso.', 'announcement', FALSE)
            RETURNING
                id,
                course_id AS "courseId",
                name,
                description,
                type,
                is_locked AS "isLocked";
        `, [course.id]);

        await client.query("COMMIT");

        return {
            ...course,
            chatChannels: channelRows.map(mapChatChannel)
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function updateAdminCourse(courseId, data) {
    const { teacherId, classroomId, secondaryClassroomId, currentWeek } = data;

    const { rows } = await pool.query(`
        UPDATE courses
        SET teacher_id = $2,
            classroom_id = NULLIF($3, 0),
            secondary_classroom_id = NULLIF($4, 0),
            current_week = $5
        WHERE id = $1
        RETURNING
            id,
            short_name AS "shortName",
            title,
            slug,
            teacher_id AS "teacherId",
            classroom_id AS "classroomId",
            secondary_classroom_id AS "secondaryClassroomId",
            current_week AS "currentWeek";
    `, [courseId, teacherId, classroomId, secondaryClassroomId, currentWeek]);

    return rows[0] ?? null;
}

export async function deleteAdminCourse(courseId) {
    const { rows } = await pool.query(`
        DELETE FROM courses
        WHERE id = $1
        RETURNING id;
    `, [courseId]);

    return rows[0] ?? null;
}