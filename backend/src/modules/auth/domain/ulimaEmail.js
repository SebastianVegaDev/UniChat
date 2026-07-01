import { BadRequestError } from "../../../errors/index.js";

const ULIMA_EMAIL_REGEX = /^\d{8}@aloe\.ulima\.edu\.pe$/;

export function getUlimaEmailIdentity(email) {
    const cleanEmail = String(email ?? "").trim().toLowerCase();

    if (!ULIMA_EMAIL_REGEX.test(cleanEmail)) {
        throw new BadRequestError("Email is invalid");
    }

    return {
        email: cleanEmail,
        code: cleanEmail.slice(0, 8)
    };
}