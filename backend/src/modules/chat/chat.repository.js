import { pool } from "../../config/db.js";

export async function findAllChatChannels(userId) {
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
            chat_channels.id,
            chat_channels.course_id AS "courseId",
            chat_channels.name,
            chat_channels.description,
            chat_channels.type,
            chat_channels.is_locked AS "isLocked"
        FROM chat_channels
        WHERE chat_channels.course_id IN(
            SELECT course_id
            FROM user_courses
        )
        ORDER BY chat_channels.course_id;
    `, [userId]);

    return rows;
}

export async function findAllChatMessages(userId) {
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
        ),
        user_channels AS(
            SELECT id
            FROM chat_channels
            WHERE course_id IN(
                SELECT course_id
                FROM user_courses
            )
        )

        SELECT
            chat_messages.id,
            chat_messages.channel_id AS "channelId",
            chat_messages.sender_id AS "senderId",
            chat_messages.body,
            chat_messages.is_pinned AS "isPinned",
            chat_messages.created_at AS "createdAt",
            COALESCE(
                array_agg(chat_message_reads.user_id)
                    FILTER (WHERE chat_message_reads.user_id IS NOT NULL),
                '{}'
            ) AS "readBy"
        FROM chat_messages
        LEFT JOIN chat_message_reads
            ON chat_message_reads.message_id = chat_messages.id
        WHERE chat_messages.channel_id IN (
            SELECT id FROM user_channels
        )
        GROUP BY chat_messages.id
        ORDER BY chat_messages.channel_id ASC, chat_messages.created_at ASC;
    `, [userId]);

    return rows;
}

export async function createChatMessage({channelId, userId, body}) {
    const { rows } = await pool.query(`
        INSERT INTO 
        chat_messages (
            channel_id, 
            sender_id, 
            body
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            channel_id AS "channelId",
            sender_id AS "senderId",
            body,
            is_pinned AS "isPinned",
            created_at AS "createdAt",
            ARRAY[]::text[] AS "readBy";
    `, [channelId, userId, body])

    return rows[0];
}
