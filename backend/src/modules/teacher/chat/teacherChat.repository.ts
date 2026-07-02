import { pool } from "../../../config/db.js";
import type { TeacherChatLockInput, TeacherFixedMessageInput, TeacherRow } from "../types/teacher.types.js";

export async function updateTeacherChatChannelLock({
    channelId,
    isLocked
}: TeacherChatLockInput): Promise<TeacherRow | null> {
    const {rows} = await pool.query<TeacherRow>(`
        UPDATE chat_channels
        SET is_locked = $1
        WHERE id = $2
        RETURNING
            id,
            is_locked AS "isLocked";
    `, [isLocked, channelId])

    return rows[0];
}

export async function updateTeacherFixedMessage({
    messageId,
    channelId
}: TeacherFixedMessageInput): Promise<TeacherRow | null> {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await client.query(`
            UPDATE chat_messages
            SET is_pinned = FALSE
            WHERE channel_id = $1
                AND is_deleted = FALSE;
        `, [channelId]);

        const {rows} = await client.query<TeacherRow>(`
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
