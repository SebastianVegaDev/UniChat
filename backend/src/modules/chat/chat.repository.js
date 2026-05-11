import { pool } from "../../config/db.js";

export async function findAllChat() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}