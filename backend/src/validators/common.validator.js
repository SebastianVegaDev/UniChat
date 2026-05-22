import { BadRequestError } from "../errors/AppError.js";

export function validateRequiredString(value, fieldName, maxLength) {
    if (typeof value !== "string" || !value.trim()) {
        throw new BadRequestError(`${fieldName} is required`);
    }

    const cleanValue = value.trim();

    if(maxLength && cleanValue.length > maxLength) {
        throw new BadRequestError(`${fieldName} is too long`);
    }

    return cleanValue;
}

export function validateOptionalString(value, fieldName, maxLength) {
    if (value === undefined || value === null || value === "") {
        return ""
    }

    if (typeof value !== "string") {
        throw new BadRequestError(`${fieldName} must be a text`);
    }

    const cleanValue = value.trim();

    if (maxLength && cleanValue.length > maxLength) {
        throw new BadRequestError(`${fieldName} is too long`);
    }

    return cleanValue;
}

export function validateRequiredId(value, fieldName) {
    const numberValue = Number(value);

    if(!Number.isInteger(numberValue) || numberValue <= 0) {
        throw new BadRequestError(`${fieldName} must be a valid id`);
    }

    return numberValue;
}

export function validateNonNegativeInteger(value, fieldName) {
    const numberValue = Number(value ?? 0);

    if (!Number.isInteger(numberValue) || numberValue < 0) {
        throw new BadRequestError(`${fieldName} must be a valid number`);
    }

    return numberValue;
}

export function validateEnum(value, fieldName, allowedValues) {
    if (!allowedValues.includes(value)) {
        throw new BadRequestError(`${fieldName} is invalid`);
    }

    return value;
}

export function validateBoolean(value, fieldName) {
    if (typeof value !== "boolean") {
        throw new BadRequestError(`${fieldName} must be true or false`);
    }

    return value;
}

export function validateDate(value, fieldName) {
    if (!value) {
        throw new BadRequestError(`${fieldName} is required`);
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        throw new BadRequestError(`${fieldName} must be a valid date`)
    }

    return value;
}

export function validateOptionalDate(value, fieldName) {
    if (!value) return null

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new BadRequestError(`${fieldName} must be a valid date`)
    }

    return value;
}