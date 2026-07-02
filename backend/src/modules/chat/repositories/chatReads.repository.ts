import { pool } from "../../../config/db.js";
import type { ChatRow, ChannelUserInput } from "../types/chat.types.js";

export async function markChannelMessagesAsRead({ channelId, userId }: ChannelUserInput): Promise<ChatRow[]> {
    const { rows } = await pool.query<ChatRow>(`
        INSERT INTO chat_message_reads (
            message_id,
            user_id
        )
        SELECT
            chat_messages.id,
            $2
        FROM chat_messages
        WHERE chat_messages.channel_id = $1
            AND chat_messages.sender_id <> $2
            AND chat_messages.is_deleted = FALSE
        ON CONFLICT (message_id, user_id) DO NOTHING
        RETURNING
            message_id AS "messageId";
    `, [channelId, userId]);

    return rows;
}
