import { BadRequestError } from "../errors/index.js";
import {
    validateRequiredString
} from "./common.validator.js";

function validateCode(code) {
    const cleanCode = validateRequiredString(code, "Code", 8);

    if (!/^\d{8}$/.test(cleanCode)) {
        throw new BadRequestError("Code is invalid");
    }

    return cleanCode;
}

function validateEmail(email) {
    const cleanEmail = validateRequiredString(email, "Email", 255).toLowerCase();

    const emailRegex = /^\d{8}@aloe\.ulima\.edu\.pe$/;

    if (!emailRegex.test(cleanEmail)) {
        throw new BadRequestError("Email is invalid");
    }

    const code = cleanEmail.slice(0, 8);

    return {
        email: cleanEmail,
        code
    };
}


function validatePassword(password) {
    const cleanPassword = validateRequiredString(password, "Password");

    if (cleanPassword.length < 6) {
        throw new BadRequestError("Password must have at least 6 characters");
    }

    return cleanPassword;
}

export function validateLogin(body = {}) {
    return {
        code: validateCode(body.code),
        password: validateRequiredString(body.password, "Password")
    };
}

export function validateRegister(body = {}) {
    const password = validatePassword(body.password);
    const repeatPassword = validateRequiredString(body.repeatPassword, "Repeat password");
    const { email, code } = validateEmail(body.email)

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

export function validateGoogleAuth(body = {}) {
    return {
        accessToken: validateRequiredString(body.accessToken, "Google access token")
    };
}

export function validateGoogleEmail(email) {
    return validateEmail(email);
}
