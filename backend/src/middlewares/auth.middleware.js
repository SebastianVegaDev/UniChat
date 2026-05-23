import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../errors/index.js";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new UnauthorizedError("Token required"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return next(new UnauthorizedError("Token required"));
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: payload.id,
            role: payload.role
        };

        next()
    } catch {
        return res.status(401).json({ error: "Invalid or expired token"})
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
