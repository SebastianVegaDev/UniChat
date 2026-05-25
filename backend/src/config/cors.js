const DEFAULT_CLIENT_ORIGINS = ["http://localhost:5173"];

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
            ...parseOrigins(process.env.CLIENT_ORIGINS || process.env.CORS_ORIGINS)
        ])
    ];
}

export function isAllowedOrigin(origin) {
    return !origin || getClientOrigins().includes(origin);
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
