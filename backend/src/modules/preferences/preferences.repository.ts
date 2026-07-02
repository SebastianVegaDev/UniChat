import { pool } from "../../config/db.js";
import type { EntityId } from "../../shared/types/domain.types.js";
import type { PreferencesInput, PreferencesRow } from "./types/preferences.types.js";

export async function findUserPreferences(userId: EntityId): Promise<PreferencesRow | null> {
    const { rows } = await pool.query<PreferencesRow>(`
        SELECT
            user_id AS "userId",
            language,
            chat_wallpaper_name AS "chatWallpaperName",
            chat_wallpaper_url AS "chatWallpaperUrl",
            color_palette AS "colorPalette",
            chat_font_size AS "chatFontSize",
            show_read_check AS "showReadCheck",
            updated_at AS "updatedAt"
        FROM user_preferences
        WHERE user_id = $1;
    `, [userId]);

    return rows[0] ?? null;
}

export async function createDefaultUserPreferences(userId: EntityId): Promise<PreferencesRow | null> {
    const { rows } = await pool.query<PreferencesRow>(`
        INSERT INTO user_preferences (
            user_id
        )
        VALUES ($1)
        ON CONFLICT (user_id) DO NOTHING
        RETURNING
            user_id AS "userId",
            language,
            chat_wallpaper_name AS "chatWallpaperName",
            chat_wallpaper_url AS "chatWallpaperUrl",
            color_palette AS "colorPalette",
            chat_font_size AS "chatFontSize",
            show_read_check AS "showReadCheck",
            updated_at AS "updatedAt";
    `, [userId]);

    return rows[0] ?? await findUserPreferences(userId);
}

export async function updateUserPreferences(data: PreferencesInput): Promise<PreferencesRow> {
    const {
        userId,
        language,
        chatWallpaperName,
        chatWallpaperUrl,
        colorPalette,
        chatFontSize,
        showReadCheck
    } = data;

    const { rows } = await pool.query<PreferencesRow>(`
        INSERT INTO user_preferences (
            user_id,
            language,
            chat_wallpaper_name,
            chat_wallpaper_url,
            color_palette,
            chat_font_size,
            show_read_check
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id) DO UPDATE
        SET language = EXCLUDED.language,
            chat_wallpaper_name = EXCLUDED.chat_wallpaper_name,
            chat_wallpaper_url = EXCLUDED.chat_wallpaper_url,
            color_palette = EXCLUDED.color_palette,
            chat_font_size = EXCLUDED.chat_font_size,
            show_read_check = EXCLUDED.show_read_check,
            updated_at = NOW()
        RETURNING
            user_id AS "userId",
            language,
            chat_wallpaper_name AS "chatWallpaperName",
            chat_wallpaper_url AS "chatWallpaperUrl",
            color_palette AS "colorPalette",
            chat_font_size AS "chatFontSize",
            show_read_check AS "showReadCheck",
            updated_at AS "updatedAt";
    `, [userId, language, chatWallpaperName, chatWallpaperUrl, colorPalette, chatFontSize, showReadCheck]);

    return rows[0];
}
