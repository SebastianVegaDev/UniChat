import { pool } from "../../config/db.js";

export async function findAllCalendarEvents() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}