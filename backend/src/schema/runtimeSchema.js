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
    `);
}
