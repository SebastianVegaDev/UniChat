import { BadRequestError } from "../errors/index.js";
import {
    validateRequiredString
} from "./common.validator.js";

function validateEmail(email) {
    const cleanEmail = validateRequiredString(email, "Email", 255).toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
        throw new BadRequestError("Email is invalid");
    }

    return cleanEmail;
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
        code: validateRequiredString(body.code, "Code", 8),
        password: validateRequiredString(body.password, "Password")
    };
}

export function validateRegister(body = {}) {
    const password = validatePassword(body.password);
    const repeatPassword = validateRequiredString(body.repeatPassword, "Repeat password");

    if (password !== repeatPassword) {
        throw new BadRequestError("Passwords do not match");
    }

    return {
        firstName: validateRequiredString(body.firstName, "First name", 100),
        lastName: validateRequiredString(body.lastName, "Last name", 100),
        email: validateEmail(body.email),
        password
    };
}
