const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        ...options
    });

    const result = response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(result?.error || "Request failed");
    }

    return result;
}

export async function apiGet(path) {
    return request(path, {
        method: "GET"
    })
}

export async function apiPost(path, data) {
    return request(path, {
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function apiPatch(path, data) {
    return request(path, {
        method: "PATCH",
        body: JSON.stringify(data)
    })
}
