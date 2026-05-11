import { pool } from "../../config/db.js";

export async function findAllCourses() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}