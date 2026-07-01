import { ForbiddenError } from "../errors/index.js";
import { getBearerToken, verifyJwtToken } from "../shared/auth/jwtSession.js";

export function authMiddleware(req, res, next) {
    try {
        const token = getBearerToken(req.headers.authorization);

        req.user = verifyJwtToken(token);

        next();
    } catch (error) {
        next(error);
    }
}

export function requireTeacher(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return next(new ForbiddenError("Forbidden"));
        }

        next();
    };
}

export function requireRole(role) {
    return requireTeacher(role);
}