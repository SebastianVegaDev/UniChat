import { BadRequestError } from "../errors/index.js";
import { getUlimaEmailIdentity } from "../modules/auth/domain/ulimaEmail.js";
import { validateRequiredString } from "./common.validator.js";

function validateCode(code: unknown): string {
    const cleanCode = validateRequiredString(code, "Code", 8);

    if (!/^\d{8}$/.test(cleanCode)) {
        throw new BadRequestError("Code is invalid");
    }

    return cleanCode;
}

function validateEmail(email: unknown): { email: string; code: string } {
    const cleanEmail = validateRequiredString(email, "Email", 255);

    return getUlimaEmailIdentity(cleanEmail);
}

function validatePassword(password: unknown): string {
    const cleanPassword = validateRequiredString(password, "Password");

    if (cleanPassword.length < 6) {
        throw new BadRequestError("Password must have at least 6 characters");
    }

    return cleanPassword;
}

export function validateLogin(body: Record<string, unknown> = {}) {
    return {
        code: validateCode(body.code),
        password: validateRequiredString(body.password, "Password")
    };
}

export function validateRegister(body: Record<string, unknown> = {}) {
    const password = validatePassword(body.password);
    const repeatPassword = validateRequiredString(body.repeatPassword, "Repeat password");
    const { email, code } = validateEmail(body.email);

    if (password !== repeatPassword) {
        throw new BadRequestError("Passwords do not match");
    }

    return {
        firstName: validateRequiredString(body.firstName, "First name", 100),
        lastName: validateRequiredString(body.lastName, "Last name", 100),
        email,
        code,
        password
    };
}

export function validateGoogleAuth(body: Record<string, unknown> = {}) {
    return {
        accessToken: validateRequiredString(body.accessToken, "Google access token")
    };
}

export function validateGoogleEmail(email: unknown): { email: string; code: string } {
    return validateEmail(email);
}
