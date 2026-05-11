import { pool } from "../../config/db.js";

export async function findAllClassSessions() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}