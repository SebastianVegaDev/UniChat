import { pool } from "../../config/db.js";

export async function findAllAnnouncements() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}