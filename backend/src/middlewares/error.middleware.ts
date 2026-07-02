import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

type HttpError = Error & {
    statusCode?: number;
};

export const errorMiddleware: ErrorRequestHandler = (
    error: HttpError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const statusCode = error.statusCode ?? 500;
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
};
