import { pool } from "../../config/db.js"
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function findCourseStats(userId: EntityId): Promise<DatabaseRow[]> {
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
        member_stats AS (
            SELECT
                course_members.course_id,
                COUNT(*) FILTER (
                    WHERE course_members.status = 'active'
                ) AS students_count,
                COUNT(*) FILTER (
                    WHERE course_members.status = 'active'
                        AND course_members.course_role = 'delegate'
                ) AS delegates_count
            FROM course_members
            WHERE course_members.course_id IN (
                SELECT course_id
                FROM user_courses
            )
            GROUP BY course_members.course_id
        ),
        pending_stats AS (
            SELECT
                calendar_events.course_id,
                COUNT(*) FILTER (
                    WHERE calendar_events.is_cancelled = FALSE
                        AND calendar_events.starts_at >= NOW()
                ) AS pending_items_count
            FROM calendar_events
            WHERE calendar_events.course_id IN (
                SELECT course_id
                FROM user_courses
            )
                AND calendar_events.is_deleted = FALSE
            GROUP BY calendar_events.course_id
        ),
        folder_stats AS (
            SELECT
                resources.course_id,
                COUNT(DISTINCT resources.week_number) AS folders_count
            FROM resources
            WHERE resources.course_id IN (
                SELECT course_id
                FROM user_courses
            )
                AND resources.is_deleted = FALSE
            GROUP BY resources.course_id
        ),
        unread_stats AS (
            SELECT
                chat_channels.course_id,
                COUNT(chat_messages.id) AS unread_messages_count
            FROM chat_messages
            INNER JOIN chat_channels
                ON chat_channels.id = chat_messages.channel_id
            LEFT JOIN chat_message_reads
                ON chat_message_reads.message_id = chat_messages.id
                AND chat_message_reads.user_id = $1
            WHERE chat_channels.course_id IN (
                SELECT course_id
                FROM user_courses
            )
                AND chat_messages.sender_id <> $1
                AND chat_messages.is_deleted = FALSE
                AND chat_message_reads.user_id IS NULL
            GROUP BY chat_channels.course_id
        ),
        last_activity_stats AS (
            SELECT
                course_id,
                MAX(activity_at) AS last_activity_at
            FROM (
                SELECT
                    chat_channels.course_id,
                    chat_messages.created_at AS activity_at
                FROM chat_messages
                INNER JOIN chat_channels
                    ON chat_channels.id = chat_messages.channel_id
                WHERE chat_channels.course_id IN (
                    SELECT course_id
                    FROM user_courses
                )
                    AND chat_messages.is_deleted = FALSE

                UNION ALL

                SELECT
                    resources.course_id,
                    resources.created_at AS activity_at
                FROM resources
                WHERE resources.course_id IN (
                    SELECT course_id
                    FROM user_courses
                )
                    AND resources.is_deleted = FALSE

                UNION ALL

                SELECT
                    calendar_events.course_id,
                    calendar_events.created_at AS activity_at
                FROM calendar_events
                WHERE calendar_events.course_id IN (
                    SELECT course_id
                    FROM user_courses
                )
                    AND calendar_events.is_deleted = FALSE
            ) activities
            GROUP BY course_id
        )

        SELECT
            user_courses.course_id AS "courseId",
            COALESCE(member_stats.students_count, 0)::int AS "studentsCount",
            COALESCE(member_stats.delegates_count, 0)::int AS "delegatesCount",
            COALESCE(unread_stats.unread_messages_count, 0)::int AS "unreadMessagesCount",
            COALESCE(pending_stats.pending_items_count, 0)::int AS "pendingItemsCount",
            COALESCE(folder_stats.folders_count, 0)::int AS "foldersCount",
            last_activity_stats.last_activity_at AS "lastActivityAt"
        FROM user_courses
        LEFT JOIN member_stats
            ON member_stats.course_id = user_courses.course_id
        LEFT JOIN pending_stats
            ON pending_stats.course_id = user_courses.course_id
        LEFT JOIN folder_stats
            ON folder_stats.course_id = user_courses.course_id
        LEFT JOIN unread_stats
            ON unread_stats.course_id = user_courses.course_id
        LEFT JOIN last_activity_stats
            ON last_activity_stats.course_id = user_courses.course_id
        ORDER BY user_courses.course_id ASC;
    `, [userId]);

    return rows;
}
