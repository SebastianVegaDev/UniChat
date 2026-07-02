import { pool } from "../../../config/db.js";
import type { AuthUser, InsertUserInput } from "../types/auth.types.js";

export async function findUserByCode(code: string): Promise<AuthUser | null> {
    const { rows } = await pool.query<AuthUser>(`
        SELECT
            id,
            code,
            first_name,
            last_name,
            email,
            password_hash,
            role,
            is_blocked,
            avatar_url
        FROM users
        WHERE code = $1
    `, [code]);

    return rows[0] ?? null;
}

export async function findUserByEmailOrCode(email: string, code: string): Promise<AuthUser | null> {
    const { rows } = await pool.query<AuthUser>(`
        SELECT
            id,
            code,
            first_name,
            last_name,
            email,
            role,
            is_blocked,
            avatar_url
        FROM users
        WHERE email = $1
            OR code = $2;
    `, [email, code]);

    return rows[0] ?? null;
}

export async function insertUser({
    firstName,
    lastName,
    email,
    code,
    passwordHash
}: InsertUserInput): Promise<AuthUser | null> {
    const { rows } = await pool.query<AuthUser>(`
        INSERT INTO users (
            code,
            first_name,
            last_name,
            email,
            password_hash,
            role
        )
        VALUES ($1, $2, $3, $4, $5, 'student')
        RETURNING
            id,
            code,
            first_name,
            last_name,
            email,
            role,
            is_blocked,
            avatar_url;
    `, [code, firstName, lastName, email, passwordHash]);

    return rows[0] ?? null;
}
