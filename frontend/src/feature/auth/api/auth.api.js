import { apiPost } from "../../../shared/api/client.js";

export async function fetchLogin(data) {
    return apiPost("/auth/login", data);
}

export async function fetchRegister(data) {
    return apiPost("/auth/register", data);
}

export async function fetchGoogleAuth(data) {
    return apiPost("/auth/google", data);
}
