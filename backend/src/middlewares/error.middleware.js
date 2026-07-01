import { env } from "../config/env.js";

export function errorMiddleware(error, req, res, _next) {
    const statusCode = error.statusCode || 500;
    const isServerError = statusCode >= 500;
    const message = isServerError && env.nodeEnv === "production"
        ? "Internal server error"
        : error.message || "Internal server error";

    if (isServerError) {
        console.error(error);
    }

    res.status(statusCode).json({
        success: false,
        error: message
    });
}
