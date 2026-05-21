import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByCode, findUserByEmail, insertUser } from "./auth.repository.js";
import { UnauthorizedError, ConflictError } from "../../errors/AppError.js";

export async function loginService(data) {
    const { code, password } = data;

    const user = await findUserByCode(code);

    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
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

export async function registerService(data) {
    const { firstName, lastName, email, password } = data;

    const userExist = await findUserByEmail(email);

    if (userExist) {
        throw new ConflictError("User al ready exist!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const code = email.slice(0,8)

    const user = await insertUser({
        firstName,
        lastName,
        email,
        code,
        passwordHash
    })

    return user;
}