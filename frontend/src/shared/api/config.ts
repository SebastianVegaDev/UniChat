import { env } from "../config/env.js";

export const API_URL = env.apiUrl;

export const SOCKET_URL = env.socketUrl;

export const API_ASSET_URL = API_URL.replace(/\/api\/?$/, "");

export function getApiAssetUrl(fileUrl?: string | null): string {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http")) return fileUrl;
    if (fileUrl.startsWith("blob:")) return fileUrl;
    if (fileUrl.startsWith("data:")) return fileUrl;

    return `${API_ASSET_URL}${fileUrl}`;
}
