import { pool } from "../../config/db.js"

export async function findTeacherCourseAccess({courseId, teacherId}) {
    const { rows } = await pool.query(`
        SELECT
            courses.id AS "courseId"
        FROM courses
        WHERE courses.id = $1
            AND courses.teacher_id = $2;
    `, [courseId, teacherId])

    return rows[0] ?? null;
}

export async function findTeacherResourceAccess({resourceId, teacherId}) {
    const { rows } = await pool.query(`
        SELECT
            resources.id AS "resourceId",
            resources.course_id AS "courseId"
        FROM resources
        INNER JOIN courses
            ON courses.id = resources.course_id
        WHERE resources.id = $1
            AND courses.teacher_id = $2
            AND resources.is_deleted = FALSE;
    `, [resourceId, teacherId])

    return rows[0] ?? null;
}

export async function findTeacherCalendarEventAccess({calendarEventId, teacherId}) {
    const { rows } = await pool.query(`
        SELECT
            calendar_events.id AS "calendarEventId",
            calendar_events.course_id AS "courseId"
        FROM calendar_events
        INNER JOIN courses
            ON courses.id = calendar_events.course_id
        WHERE calendar_events.id = $1
            AND courses.teacher_id = $2
            AND calendar_events.is_deleted = FALSE;
    `, [calendarEventId, teacherId])

    return rows[0] ?? null;
}

export async function findTeacherChannelAccess({channelId, teacherId}) {
    const { rows } = await pool.query(`
        SELECT
            chat_channels.id AS "channelId",
            chat_channels.course_id AS "courseId"
        FROM chat_channels
        INNER JOIN courses
            ON courses.id = chat_channels.course_id
        WHERE chat_channels.id = $1
            AND courses.teacher_id = $2;
    `, [channelId, teacherId])

    return rows[0] ?? null;
}

export async function findUserChannelAccess({ userId, channelId }) {
    const { rows } = await pool.query(`
        SELECT
            chat_channels.id AS "channelId",
            chat_channels.course_id AS "courseId",
            chat_channels.is_locked AS "isLocked",
            (courses.teacher_id = $2) AS "isTeacher"
        FROM chat_channels
        INNER JOIN courses
            ON courses.id = chat_channels.course_id
        LEFT JOIN course_members
            ON course_members.course_id = courses.id
            AND course_members.user_id = $2
            AND course_members.status = 'active'
        WHERE chat_channels.id = $1
            AND (
                courses.teacher_id = $2
                OR course_members.user_id IS NOT NULL
            );
    `, [channelId, userId]);

    return rows[0] ?? null;
}

export async function findChatMessageAccess({ userId, messageId }) {
    const { rows } = await pool.query(`
        SELECT
            chat_messages.id AS "messageId",
            chat_messages.channel_id AS "channelId",
            chat_channels.course_id AS "courseId",
            chat_messages.sender_id AS "senderId",
            (chat_messages.sender_id = $2) AS "isOwner",
            (courses.teacher_id = $2) AS "isTeacher"
        FROM chat_messages
        INNER JOIN chat_channels
            ON chat_channels.id = chat_messages.channel_id
        INNER JOIN courses
            ON courses.id = chat_channels.course_id
        WHERE chat_messages.id = $1
            AND chat_messages.is_deleted = FALSE;
    `, [messageId, userId]);

    return rows[0] ?? null;
}
