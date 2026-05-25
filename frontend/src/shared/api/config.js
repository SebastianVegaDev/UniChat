export const API_URL = import.meta.env.VITE_API_URL || (
    import.meta.env.DEV ? "http://localhost:3000/api" : "/api"
);

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (
    import.meta.env.DEV ? "http://localhost:3000" : window.location.origin
);

export const API_ASSET_URL = API_URL.replace(/\/api\/?$/, "");

export function getApiAssetUrl(fileUrl) {
    if (!fileUrl) return "";
    if (fileUrl.startsWith("http")) return fileUrl;
    if (fileUrl.startsWith("blob:")) return fileUrl;
    if (fileUrl.startsWith("data:")) return fileUrl;

    return `${API_ASSET_URL}${fileUrl}`;
}
