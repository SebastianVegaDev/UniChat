import { pool } from "../../../config/db.js";
import type { EntityId } from "../../../shared/types/domain.types.js";
import type { ChatRow } from "../types/chat.types.js";

export async function findAllChatChannels(userId: EntityId): Promise<ChatRow[]> {
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
