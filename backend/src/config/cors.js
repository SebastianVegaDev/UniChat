import { env } from "./env.js";

const DEFAULT_CLIENT_ORIGINS = ["http://localhost:5173", "http://localhost:8080"];

function parseOrigins(value = "") {
    return value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}

export function getClientOrigins() {
    return [
        ...new Set([
            ...DEFAULT_CLIENT_ORIGINS,
            ...parseOrigins(env.clientOrigins)
        ])
    ];
}

export function isAllowedOrigin(origin) {
    if (!origin) return true;

    return getClientOrigins().includes(origin);
}

export function createCorsOptions() {
    return {
        origin(origin, callback) {
            if (isAllowedOrigin(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    };
}
