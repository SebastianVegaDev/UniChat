import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { findUserByCode, findUserByEmailOrCode, insertUser } from "./auth.repository.js";
import { UnauthorizedError, ConflictError } from "../../errors/AppError.js";
import { validateGoogleEmail } from "../../validators/auth.validator.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function createSession(user) {
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

export async function loginService(data) {
    const { code, password } = data;

    const user = await findUserByCode(code);

    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.password_hash) {
        throw new UnauthorizedError("Use Google login for this account");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
    }

    return createSession(user);
}

export async function registerService(data) {
    const { firstName, lastName, email, code, password } = data;

    const userExist = await findUserByEmailOrCode(email, code);

    if (userExist) {
        throw new ConflictError("User al ready exist!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await insertUser({
        firstName,
        lastName,
        email,
        code,
        passwordHash
    })

    return user;
}

export async function googleAuthService(data) {
    const { accessToken } = data

    let tokenInfo;

    try {
        tokenInfo = await googleClient.getTokenInfo(accessToken);
    } catch {
        throw new UnauthorizedError("Invalid Google token");
    }

    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new UnauthorizedError("Invalid Google token");
    }

    if (!tokenInfo.email_verified) {
        throw new UnauthorizedError("Google email is not verified");
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!profileResponse.ok) {
        throw new UnauthorizedError("Invalid Google token");
    }

    const profile = await profileResponse.json();
    const { email, code } = validateGoogleEmail(tokenInfo.email);

    let user = await findUserByEmailOrCode(email, code);

    if (!user) {
        user = await insertUser({
            firstName: profile.given_name || "User",
            lastName: profile.family_name || "",
            email,
            code,
            passwordHash: null
        });
    }

    return createSession(user);
}
