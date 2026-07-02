import { BadRequestError } from "../errors/AppError.js";

export type RequestBody = Record<string, unknown>;

export function validateRequiredString(value: unknown, fieldName: string, maxLength?: number): string {
    if (typeof value !== "string" || !value.trim()) {
        throw new BadRequestError(`${fieldName} is required`);
    }

    const cleanValue = value.trim();

    if(maxLength && cleanValue.length > maxLength) {
        throw new BadRequestError(`${fieldName} is too long`);
    }

    return cleanValue;
}

export function validateOptionalString(value: unknown, fieldName: string, maxLength?: number): string {
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

export function validateRequiredId(value: unknown, fieldName: string): number {
    const numberValue = Number(value);

    if(!Number.isInteger(numberValue) || numberValue <= 0) {
        throw new BadRequestError(`${fieldName} must be a valid id`);
    }

    return numberValue;
}

export function validateNonNegativeInteger(value: unknown, fieldName: string): number {
    const numberValue = Number(value ?? 0);

    if (!Number.isInteger(numberValue) || numberValue < 0) {
        throw new BadRequestError(`${fieldName} must be a valid number`);
    }

    return numberValue;
}

export function validateEnum<T extends string>(value: unknown, fieldName: string, allowedValues: readonly T[]): T {
    if (typeof value !== "string" || !allowedValues.includes(value as T)) {
        throw new BadRequestError(`${fieldName} is invalid`);
    }

    return value as T;
}

export function validateBoolean(value: unknown, fieldName: string): boolean {
    if (typeof value !== "boolean") {
        throw new BadRequestError(`${fieldName} must be true or false`);
    }

    return value;
}

export function validateDate(value: unknown, fieldName: string): string {
    if (!value) {
        throw new BadRequestError(`${fieldName} is required`);
    }

    const date = new Date(String(value))

    if (Number.isNaN(date.getTime())) {
        throw new BadRequestError(`${fieldName} must be a valid date`)
    }

    return String(value);
}

export function validateOptionalDate(value: unknown, fieldName: string): string | null {
    if (!value) return null

    const date = new Date(String(value));

    if (Number.isNaN(date.getTime())) {
        throw new BadRequestError(`${fieldName} must be a valid date`)
    }

    return String(value);
}

export function validateEndDateAfterStartDate(body: RequestBody): { startsAt: string; endsAt: string | null } {
    const startsAt = validateDate(body.startsAt, "Start date");
    const endsAt = validateDate(body.endsAt, "End date");

    if (new Date(String(endsAt)).getTime() < new Date(String(startsAt)).getTime()) {
        throw new BadRequestError("End date must be after start date");
    }

    return { startsAt, endsAt };
}
