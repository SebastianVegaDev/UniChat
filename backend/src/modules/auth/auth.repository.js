import { pool } from "../../config/db.js";

export async function findUserByCode(code) {
    const { rows } = await pool.query(`
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

    return rows[0];
}

export async function findUserByEmailOrCode(email, code) {
    const { rows } = await pool.query(`
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

    return rows[0];
}

export async function insertUser({firstName, lastName, email, code, passwordHash}) {
    const { rows } = await pool.query(`
        INSERT INTO users
        (code, first_name, last_name, email, password_hash, role)
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
    `, [code, firstName, lastName, email, passwordHash])

    return rows[0];
}
