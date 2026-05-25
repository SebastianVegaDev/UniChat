import { pool } from "../config/db.js";

export async function ensureRuntimeSchema() {
    await pool.query(`
        ALTER TABLE chat_messages
            ADD COLUMN IF NOT EXISTS attachment_type TEXT NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS attachment_url TEXT NOT NULL DEFAULT '',
            ADD COLUMN IF NOT EXISTS attachment_name TEXT NOT NULL DEFAULT '';

        ALTER TABLE user_preferences
            ALTER COLUMN color_palette SET DEFAULT 'white';

        UPDATE user_preferences
        SET color_palette = 'white'
        WHERE color_palette = 'gamer';

        ALTER TABLE user_preferences
            DROP CONSTRAINT IF EXISTS user_preferences_color_palette_check,
            ADD CONSTRAINT user_preferences_color_palette_check
                CHECK (color_palette IN ('dark', 'white', 'pink', 'dark-orange', 'white-orange'));

        CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower_unique
            ON users(LOWER(email));
        CREATE INDEX IF NOT EXISTS idx_users_code ON users(code);
        CREATE INDEX IF NOT EXISTS idx_course_members_active_user
            ON course_members(user_id, status)
            WHERE status = 'active';
        CREATE INDEX IF NOT EXISTS idx_course_members_pending_delegates
            ON course_members(course_id, status)
            WHERE course_role = 'delegate' AND status = 'pending_delegate';
        CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
        CREATE INDEX IF NOT EXISTS idx_class_sessions_starts_at ON class_sessions(starts_at);
        CREATE INDEX IF NOT EXISTS idx_calendar_events_starts_at ON calendar_events(starts_at);
        CREATE INDEX IF NOT EXISTS idx_resources_course_week ON resources(course_id, week_number);
        CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
        CREATE INDEX IF NOT EXISTS idx_chat_messages_channel_created_at
            ON chat_messages(channel_id, created_at);
    `);
}
