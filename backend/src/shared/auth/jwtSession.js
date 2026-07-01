import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { UnauthorizedError } from "../../errors/index.js";

const DEFAULT_EXPIRES_IN = "1d";

function getJwtSecret() {
    if (!env.auth.jwtSecret) {
        throw new UnauthorizedError("Auth is not configured");
    }

    return env.auth.jwtSecret;
}

function mapPayloadToSessionUser(payload) {
    return {
        id: payload.id,
        role: payload.role
    };
}

export function createJwtToken(user, options = {}) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        getJwtSecret(),
        {
            expiresIn: options.expiresIn ?? DEFAULT_EXPIRES_IN
        }
    );
}

export function getBearerToken(authHeader) {
    if (!authHeader) {
        throw new UnauthorizedError("Token required");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new UnauthorizedError("Token required");
    }

    return token;
}

export function verifyJwtToken(token) {
    if (!token) {
        throw new UnauthorizedError("Token required");
    }

    try {
        const payload = jwt.verify(token, getJwtSecret());

        return mapPayloadToSessionUser(payload);
    } catch {
        throw new UnauthorizedError("Invalid or expired token");
    }
}