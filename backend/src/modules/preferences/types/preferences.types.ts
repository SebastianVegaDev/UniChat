import type { DatabaseRow, EntityId } from "../../../shared/types/domain.types.js";

export interface PreferencesInput {
    userId: EntityId;
    language: string;
    chatWallpaperName: string;
    chatWallpaperUrl: string;
    colorPalette: string;
    chatFontSize: string;
    showReadCheck: boolean;
}

export interface PreferenceWallpaperData {
    chatWallpaperName: string;
    chatWallpaperUrl: string | null;
}

export type PreferencesRow = DatabaseRow;
