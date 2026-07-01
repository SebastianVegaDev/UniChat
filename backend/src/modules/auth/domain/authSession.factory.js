import { UnauthorizedError } from "../../../errors/index.js";
import { createJwtToken } from "../../../shared/auth/jwtSession.js";

export function createAuthSession(user) {
    if (user.is_blocked) {
        throw new UnauthorizedError("User is blocked");
    }

    const token = createJwtToken(user);

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