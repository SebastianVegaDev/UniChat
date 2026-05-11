import { pool } from "../../config/db.js";

export async function findAllUsers() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}