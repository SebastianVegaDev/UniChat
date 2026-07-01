import { ConflictError } from "../../../errors/index.js";
import { hashPassword } from "../infrastructure/password/passwordHasher.js";
import { findUserByEmailOrCode, insertUser } from "../repositories/authUsers.repository.js";

export async function registerUseCase({ firstName, lastName, email, code, password }) {
    const existingUser = await findUserByEmailOrCode(email, code);

    if (existingUser) {
        throw new ConflictError("User already exists!");
    }

    const passwordHash = await hashPassword(password);

    return await insertUser({
        firstName,
        lastName,
        email,
        code,
        passwordHash
    });
}