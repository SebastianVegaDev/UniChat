import { pool } from "../../config/db.js";

export async function findAllClasrooms() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}