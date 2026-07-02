import { pool } from "../../../config/db.js";
import type { EntityId } from "../../../shared/types/domain.types.js";
import type { ChatRow, CreateChatMessageInput } from "../types/chat.types.js";

export async function findAllChatMessages(userId: EntityId): Promise<ChatRow[]> {
    const { rows } = await pool.query<ChatRow>(`
        WITH auth_user AS (
            SELECT role
            FROM users
            WHERE id = $1
        ),
        user_courses AS(
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
            chat_messages.attachment_type AS "attachmentType",
            chat_messages.attachment_url AS "attachmentUrl",
            chat_messages.attachment_name AS "attachmentName",
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

export async function createChatMessage({
    channelId,
    userId,
    body,
    attachmentType = "",
    attachmentUrl = "",
    attachmentName = ""
}: CreateChatMessageInput): Promise<ChatRow> {
    const { rows } = await pool.query<ChatRow>(`
        INSERT INTO
        chat_messages (
            channel_id,
            sender_id,
            body,
            attachment_type,
            attachment_url,
            attachment_name
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            channel_id AS "channelId",
            sender_id AS "senderId",
            body,
            attachment_type AS "attachmentType",
            attachment_url AS "attachmentUrl",
            attachment_name AS "attachmentName",
            is_pinned AS "isPinned",
            is_deleted AS "isDeleted",
            created_at AS "createdAt",
            ARRAY[]::text[] AS "readBy",
            '[]'::jsonb AS reactions;
    `, [channelId, userId, body, attachmentType, attachmentUrl, attachmentName])

    return rows[0];
}

export async function softDeleteChatMessage({ messageId }: { messageId: EntityId }): Promise<ChatRow | null> {
    const { rows } = await pool.query<ChatRow>(`
        UPDATE chat_messages
        SET body = 'Este mensaje fue eliminado',
            attachment_type = '',
            attachment_url = '',
            attachment_name = '',
            is_deleted = TRUE,
            is_pinned = FALSE
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING
            id,
            body,
            attachment_type AS "attachmentType",
            attachment_url AS "attachmentUrl",
            attachment_name AS "attachmentName",
            is_deleted AS "isDeleted",
            is_pinned AS "isPinned";
    `, [messageId])

    return rows[0];
}
