import { pool } from "../../config/db.js";

export async function findUserByCode(code) {
    const result = await pool.query(`
        SELECT
            id,
            code,
            first_name,
            last_name,
            email,
            password_hash,
            role,
            avatar_url
        FROM users
        WHERE code = $1
    `, [code]);

    return result.rows[0];
}

export async function findUserByEmail(email) {
    const result = await pool.query(`
        SELECT
            email
        FROM users
        WHERE email = $1
    `, [email]);

    return result.rows[0];
}

export async function insertUser({firstName, lastName, email, code, passwordHash}) {
    const result = await pool.query(`
        INSERT INTO users
        (code, first_name, last_name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5, 'student')
        RETURNING id;
    `, [code, firstName, lastName, email, passwordHash])

    return result.rows[0];
}