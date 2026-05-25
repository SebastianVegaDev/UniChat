import {
    validateBoolean,
    validateEnum,
    validateOptionalString
} from "./common.validator.js";

const LANGUAGES = ["English", "Spanish", "Portuguese"];
const COLOR_PALETTES = ["dark", "white", "pink", "dark-orange", "white-orange"];
const CHAT_FONT_SIZES = ["Small", "Medium", "Large"];

function normalizeBoolean(value) {
    if (value === "true") return true;
    if (value === "false") return false;

    return value;
}

export function validatePreferences(body = {}) {
    return {
        language: validateEnum(body.language, "Language", LANGUAGES),
        chatWallpaperName: validateOptionalString(body.chatWallpaperName, "Chat wallpaper", 180),
        chatWallpaperUrl: validateOptionalString(body.chatWallpaperUrl, "Chat wallpaper url", 300),
        colorPalette: validateEnum(body.colorPalette, "Color palette", COLOR_PALETTES),
        chatFontSize: validateEnum(body.chatFontSize, "Chat font size", CHAT_FONT_SIZES),
        showReadCheck: validateBoolean(normalizeBoolean(body.showReadCheck), "Show read check")
    };
}
