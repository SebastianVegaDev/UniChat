import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../errors/index.js";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const jwtSecret = process.env.JWT_SECRET;

    if (!authHeader) {
        return next(new UnauthorizedError("Token required"));
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return next(new UnauthorizedError("Token required"));
    }

    if (!jwtSecret) {
        return next(new UnauthorizedError("Auth is not configured"));
    }

    try {
        const payload = jwt.verify(token, jwtSecret);

        req.user = {
            id: payload.id,
            role: payload.role
        };

        next()
    } catch {
        return next(new UnauthorizedError("Invalid or expired token"));
    }
}

export function requireTeacher(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return next(new ForbiddenError("Forbidden"));
        }

        next();
    }
}

export function requireRole(role) {
    return requireTeacher(role);
}
