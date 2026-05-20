import { pool } from "../../../config/db.js";

export async function updateTeacherChatChannelLock({channelId, isLocked}) {
    const {rows} = await pool.query(`
        UPDATE chat_channels
        SET is_locked = $1
        WHERE id = $2
        RETURNING
            id,
            is_locked AS "isLocked";
    `, [isLocked, channelId])

    return rows[0];
}

export async function updateTeacherFixedMessage({messageId, channelId}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await client.query(`
            UPDATE chat_messages
            SET is_pinned = FALSE
            WHERE channel_id = $1
                AND is_deleted = FALSE;
        `, [channelId]);

        const {rows} = await client.query(`
            UPDATE chat_messages
            SET is_pinned = TRUE
            WHERE id = $1
                AND channel_id = $2
                AND is_deleted = FALSE
            RETURNING id;
        `, [messageId, channelId]);

        await client.query("COMMIT");

        return rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function softDeleteTeacherChatMessage({messageId}) {
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
