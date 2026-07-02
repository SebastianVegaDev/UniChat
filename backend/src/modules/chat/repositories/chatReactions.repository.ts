import { pool } from "../../../config/db.js";
import type { ChatRow, MessageReactionInput, MessageUserInput } from "../types/chat.types.js";

export async function findChatMessageReaction({ messageId, userId }: MessageUserInput): Promise<ChatRow | null> {
    const { rows } = await pool.query<ChatRow>(`
        SELECT
            message_id AS "messageId",
            user_id AS "userId",
            emoji
        FROM chat_message_reactions
        WHERE message_id = $1
            AND user_id = $2;
    `, [messageId, userId]);

    return rows[0];
}

export async function createChatMessageReaction({
    messageId,
    userId,
    emoji
}: MessageReactionInput): Promise<ChatRow> {
    const { rows } = await pool.query<ChatRow>(`
        INSERT INTO chat_message_reactions (
            message_id,
            user_id,
            emoji
        )
        VALUES ($1, $2, $3)
        RETURNING
            message_id AS "messageId",
            user_id AS "userId",
            emoji;
    `, [messageId, userId, emoji]);

    return rows[0];
}

export async function updateChatMessageReaction({
    messageId,
    userId,
    emoji
}: MessageReactionInput): Promise<ChatRow> {
    const { rows } = await pool.query<ChatRow>(`
        UPDATE chat_message_reactions
        SET emoji = $1
        WHERE message_id = $2
            AND user_id = $3
        RETURNING
            message_id AS "messageId",
            user_id AS "userId",
            emoji;
    `, [emoji, messageId, userId]);

    return rows[0];
}

export async function deleteChatMessageReaction({ messageId, userId }: MessageUserInput): Promise<ChatRow | null> {
    const { rows } = await pool.query<ChatRow>(`
        DELETE FROM chat_message_reactions
        WHERE message_id = $1
            AND user_id = $2
        RETURNING
            message_id AS "messageId",
            user_id AS "userId",
            emoji;
    `, [messageId, userId]);

    return rows[0];
}

export async function findChatMessageReactions({ messageId, userId }: MessageUserInput): Promise<ChatRow[]> {
    const { rows } = await pool.query<ChatRow>(`
        SELECT
            emoji,
            COUNT(*)::int AS count,
            BOOL_OR(user_id = $2) AS "reactedByMe"
        FROM chat_message_reactions
        WHERE message_id = $1
        GROUP BY emoji
        ORDER BY count DESC;
    `, [messageId, userId]);

    return rows;
}
