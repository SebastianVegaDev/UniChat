import type { CorsOptions } from "cors";
import { env } from "./env.js";

const DEFAULT_CLIENT_ORIGINS = ["http://localhost:5173", "http://localhost:8080"];

function parseOrigins(value = ""): string[] {
    return value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}

export function getClientOrigins(): string[] {
    return [
        ...new Set([
            ...DEFAULT_CLIENT_ORIGINS,
            ...parseOrigins(env.cors.clientOrigins)
        ])
    ];
}

export function isAllowedOrigin(origin?: string): boolean {
    if (!origin) return true;

    return getClientOrigins().includes(origin);
}

export function createCorsOptions(): CorsOptions {
    return {
        origin(origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) {
            if (isAllowedOrigin(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    };
}
