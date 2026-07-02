import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ForbiddenError } from "../errors/index.js";
import { getBearerToken, verifyJwtToken } from "../shared/auth/jwtSession.js";
import type { UserRole } from "../shared/types/domain.types.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        const token = getBearerToken(req.headers.authorization);

        req.user = verifyJwtToken(token);

        next();
    } catch (error) {
        next(error);
    }
}

export function requireTeacher(role: UserRole): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || req.user.role !== role) {
            return next(new ForbiddenError("Forbidden"));
        }

        next();
    };
}

export function requireRole(role: UserRole): RequestHandler {
    return requireTeacher(role);
}
