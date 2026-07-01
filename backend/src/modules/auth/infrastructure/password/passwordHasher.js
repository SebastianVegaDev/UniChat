import bcrypt from "bcrypt";

const PASSWORD_SALT_ROUNDS = 10;

export async function hashPassword(password) {
    return await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
}

export async function comparePassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
}