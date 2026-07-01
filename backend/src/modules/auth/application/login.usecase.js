import { UnauthorizedError } from "../../../errors/index.js";
import { createAuthSession } from "../domain/authSession.factory.js";
import { comparePassword } from "../infrastructure/password/passwordHasher.js";
import { findUserByCode } from "../repositories/authUsers.repository.js";

export async function loginUseCase({ code, password }) {
    const user = await findUserByCode(code);

    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.password_hash) {
        throw new UnauthorizedError("Use Google login for this account");
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
    }

    return createAuthSession(user);
}