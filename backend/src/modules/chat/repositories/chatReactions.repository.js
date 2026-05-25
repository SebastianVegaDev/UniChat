import { pool } from "../../../config/db.js";

export async function findChatMessageReaction({ messageId, userId }) {
    const { rows } = await pool.query(`
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

export async function createChatMessageReaction({ messageId, userId, emoji }) {
    const { rows } = await pool.query(`
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

export async function updateChatMessageReaction({ messageId, userId, emoji }) {
    const { rows } = await pool.query(`
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

export async function deleteChatMessageReaction({ messageId, userId }) {
    const { rows } = await pool.query(`
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

export async function findChatMessageReactions({ messageId, userId }) {
    const { rows } = await pool.query(`
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
