import {
    CHAT_FONT_SIZE_VALUES
} from "./languages.js";
import {
    getPreferencePalette
} from "./colors.js";

export {
    CHAT_FONT_SIZES,
    DEFAULT_CHAT_FONT_SIZE,
    LANGUAGES
} from "./languages.js";
export {
    COLOR_PALETTES,
    DEFAULT_COLOR_PALETTE,
    getPreferencePalette
} from "./colors.js";
export {
    LANGUAGE_TEXTS,
    getPreferenceTexts
} from "./texts.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_ASSET_URL = API_URL.replace(/\/api\/?$/, "");

export function getPreferenceAssetUrl(fileUrl) {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http")) return fileUrl;
    if (fileUrl.startsWith("blob:")) return fileUrl;
    if (fileUrl.startsWith("data:")) return fileUrl;

    return `${API_ASSET_URL}${fileUrl}`;
}

export function getPreferenceAppClassName(preferences) {
    const palette = getPreferencePalette(preferences.colorPalette);
    const classes = [`app-layout-palette-${palette.id}`];

    if (preferences.showReadCheck === false) {
        classes.push("hide-read-checks");
    }

    return classes.join(" ");
}

export function getPreferenceAppStyle(preferences) {
    const palette = getPreferencePalette(preferences.colorPalette);
    const wallpaperUrl = getPreferenceAssetUrl(preferences.chatWallpaperUrl);

    return {
        "--app-background": palette.chatBackground,
        "--app-surface": palette.chatSurface,
        "--app-surface-soft": palette.chatSurfaceSoft,
        "--app-border-color": palette.chatBorder,
        "--app-text-color": palette.textColor,
        "--app-muted-text-color": palette.mutedText,
        "--app-accent-color": palette.accent,
        "--app-accent-hover-color": palette.accentHover,
        "--app-accent-soft-color": palette.accentSoft,
        "--app-accent-border-color": palette.accentBorder,
        "--chat-main-background": palette.chatBackground,
        "--chat-main-surface": palette.chatSurface,
        "--chat-main-surface-soft": palette.chatSurfaceSoft,
        "--chat-main-border-color": palette.chatBorder,
        "--chat-text-color": palette.textColor,
        "--chat-accent-color": palette.accent,
        "--chat-accent-hover-color": palette.accentHover,
        "--chat-accent-soft-color": palette.accentSoft,
        "--chat-accent-border-color": palette.accentBorder,
        "--chat-me-message-color": palette.myMessage,
        "--chat-me-message-text-color": palette.myMessageText,
        "--chat-other-message-color": palette.otherMessage,
        "--chat-other-message-text-color": palette.otherMessageText,
        "--chat-other-message-border-color": palette.otherMessageBorder,
        "--chat-resource-background": palette.chatSurfaceSoft,
        "--chat-message-muted-color": palette.mutedText,
        "--chat-message-font-size": CHAT_FONT_SIZE_VALUES[preferences.chatFontSize] ?? CHAT_FONT_SIZE_VALUES.Medium,
        "--chat-read-check-color": palette.readCheck,
        "--chat-wallpaper-image": wallpaperUrl
            ? `linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.18)), url("${wallpaperUrl}")`
            : "none"
    };
}
