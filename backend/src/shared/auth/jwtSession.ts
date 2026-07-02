import jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";
import { UnauthorizedError } from "../../errors/index.js";
import type { SessionUser } from "../types/domain.types.js";

const DEFAULT_EXPIRES_IN = "1d";

function getJwtSecret(): string {
    if (!env.auth.jwtSecret) {
        throw new UnauthorizedError("Auth is not configured");
    }

    return env.auth.jwtSecret;
}

function mapPayloadToSessionUser(payload: string | JwtPayload): SessionUser {
    if (typeof payload === "string") {
        throw new UnauthorizedError("Invalid token payload");
    }

    const id = Number(payload.id);
    const role = payload.role;

    if (!Number.isInteger(id) || (role !== "admin" && role !== "teacher" && role !== "student")) {
        throw new UnauthorizedError("Invalid token payload");
    }

    return {
        id,
        role
    };
}

export function createJwtToken(user: SessionUser, options: SignOptions = {}): string {
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

export function getBearerToken(authHeader: string | undefined): string {
    if (!authHeader) {
        throw new UnauthorizedError("Token required");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new UnauthorizedError("Token required");
    }

    return token;
}

export function verifyJwtToken(token: string | undefined): SessionUser {
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
