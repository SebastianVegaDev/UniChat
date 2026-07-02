import { getAuthToken } from "../auth/sessionStorage.js";
import { API_URL } from "./config.js";

async function request(path, options = {}) {
    const token = getAuthToken();
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        ...options,
        headers: {
            ...(!isFormData ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {})
        }
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || result?.message || "Request failed");
    }

    return result;
}

export async function apiGet(path) {
    return request(path, {
        method: "GET"
    });
}

export async function apiPost(path, data) {
    return request(path, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function apiPatch(path, data) {
    return request(path, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}

export async function apiDelete(path, data) {
    return request(path, {
        method: "DELETE",
        body: JSON.stringify(data)
    });
}

export async function apiFormPost(path, data) {
    return request(path, {
        method: "POST",
        body: data
    });
}

export async function apiFormPatch(path, data) {
    return request(path, {
        method: "PATCH",
        body: data
    });
}