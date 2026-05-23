import { pool } from "../../../config/db.js";

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
            chat_messages.is_deleted AS "isDeleted",
            chat_messages.created_at AS "createdAt",
            COALESCE(
                array_agg(chat_message_reads.user_id)
                    FILTER (WHERE chat_message_reads.user_id IS NOT NULL),
                '{}'
            ) AS "readBy",
            COALESCE(reactions.reactions, '[]'::jsonb) AS reactions
        FROM chat_messages
        LEFT JOIN chat_message_reads
            ON chat_message_reads.message_id = chat_messages.id
        LEFT JOIN LATERAL (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'emoji', reaction_counts.emoji,
                    'count', reaction_counts.count,
                    'reactedByMe', reaction_counts.reacted_by_me
                )
            ) AS reactions
            FROM (
                SELECT
                    emoji,
                    COUNT(*)::int AS count,
                    BOOL_OR(user_id = $1) AS reacted_by_me
                FROM chat_message_reactions
                WHERE message_id = chat_messages.id
                GROUP BY emoji
            ) reaction_counts
        ) reactions ON TRUE
        WHERE chat_messages.channel_id IN (
            SELECT id FROM user_channels
        )
        GROUP BY chat_messages.id, reactions.reactions
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
            is_deleted AS "isDeleted",
            created_at AS "createdAt",
            ARRAY[]::text[] AS "readBy",
            '[]'::jsonb AS reactions;
    `, [channelId, userId, body])

    return rows[0];
}

export async function softDeleteChatMessage({messageId}) {
    const {rows} = await pool.query(`
        UPDATE chat_messages
        SET body = 'Este mensaje fue eliminado',
            is_deleted = TRUE,
            is_pinned = FALSE
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING
            id,
            body,
            is_deleted AS "isDeleted",
            is_pinned AS "isPinned";
    `, [messageId])

    return rows[0];
}
