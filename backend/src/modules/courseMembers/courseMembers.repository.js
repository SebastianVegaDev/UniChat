import { pool } from "../../config/db.js";

export async function findAllCourseMembers() {
    const { rows } = await pool.query(
        //CONSULT
    );

    return rows;
}