import { pool } from "../../config/db.js";

export async function findAllResources() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}