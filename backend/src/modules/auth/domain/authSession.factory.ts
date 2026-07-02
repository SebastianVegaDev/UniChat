import { UnauthorizedError } from "../../../errors/index.js";
import { createJwtToken } from "../../../shared/auth/jwtSession.js";
import type { AuthSession, AuthUser } from "../types/auth.types.js";

export function createAuthSession(user: AuthUser): AuthSession {
    if (user.is_blocked) {
        throw new UnauthorizedError("User is blocked");
    }

    const token = createJwtToken({
        id: user.id,
        role: user.role
    });

    return {
        token,
        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role
        }
    };
}
