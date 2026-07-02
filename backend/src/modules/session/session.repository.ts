import { pool } from "../../config/db.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function findSession(userId: EntityId): Promise<DatabaseRow | undefined> {
    const { rows } = await pool.query<DatabaseRow>(`
        WITH auth_user AS (
            SELECT role
            FROM users
            WHERE id = $1
        ),
        user_courses AS (
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
        default_channels AS (
            SELECT
                chat_channels.course_id,
                chat_channels.id AS channel_id
            FROM chat_channels
            WHERE chat_channels.course_id IN (
                SELECT course_id
                FROM user_courses
            )
                AND chat_channels.is_default = TRUE
        )

        SELECT
            $1 AS "currentUserId",
        COALESCE(
            json_agg(
                json_build_object(
                    'courseId', default_channels.course_id,
                    'channelId', default_channels.channel_id
                )
                ORDER BY default_channels.course_id
            ) FILTER (WHERE default_channels.channel_id IS NOT NULL),
                '[]'::json
            ) AS "activeChatChannels"
        FROM default_channels;
    `, [userId]);

    return rows[0];
}
