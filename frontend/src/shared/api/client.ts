import { getAuthToken } from "../auth/sessionStorage.js";
import { API_URL } from "./config.js";

type ApiBody = BodyInit | null;

type ApiRequestOptions = Omit<RequestInit, "body"> & {
    body?: ApiBody;
};

type ApiErrorResponse = {
    error?: string;
    message?: string;
};

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
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

    const result = await response.json().catch(() => null) as (ApiErrorResponse & T) | null;

    if (!response.ok) {
        throw new Error(result?.error || result?.message || "Request failed");
    }

    return result as T;
}

export async function apiGet<T = unknown>(path: string): Promise<T> {
    return request<T>(path, {
        method: "GET"
    });
}

export async function apiPost<T = unknown>(path: string, data: unknown): Promise<T> {
    return request<T>(path, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function apiPatch<T = unknown>(path: string, data: unknown): Promise<T> {
    return request<T>(path, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}

export async function apiDelete<T = unknown>(path: string, data: unknown = {}): Promise<T> {
    return request<T>(path, {
        method: "DELETE",
        body: JSON.stringify(data)
    });
}

export async function apiFormPost<T = unknown>(path: string, data: FormData): Promise<T> {
    return request<T>(path, {
        method: "POST",
        body: data
    });
}

export async function apiFormPatch<T = unknown>(path: string, data: FormData): Promise<T> {
    return request<T>(path, {
        method: "PATCH",
        body: data
    });
}
