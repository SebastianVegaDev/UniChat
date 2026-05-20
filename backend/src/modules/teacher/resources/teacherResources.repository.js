import { pool } from "../../../config/db.js";

export async function insertTeacherResource(
    {
        courseId,
        weekNumber, 
        title, 
        kind, 
        sizeBytes, 
        uploadedById,
        fileUrl,
        status
    }) {
    const {rows} = await pool.query(`
        INSERT INTO
        resources(
            course_id, 
            week_number, 
            title, 
            kind, 
            size_bytes, 
            uploaded_by_id,
            file_url,
            status
        )
        
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)

        RETURNING id;
    `, [
        courseId,
        weekNumber,
        title,
        kind,
        sizeBytes,
        uploadedById,
        fileUrl,
        status
    ])

    return rows[0];
}

export async function softDeleteTeacherResource({resourceId}) {
    const {rows} = await pool.query(`
        UPDATE resources
        SET is_deleted = TRUE
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING id;
    `, [resourceId])

    return rows[0];
}

export async function toggleTeacherResourceAvailability({status, resourceId}) {
    const {rows} = await pool.query(`
        UPDATE resources
        SET status = $1
        WHERE id = $2
            AND is_deleted = FALSE
        RETURNING id;
    `, [status, resourceId])

    return rows[0];
}

export async function updateTeacherResource(
    {
        resourceId,
        weekNumber,
        title,
        kind,
        sizeBytes,
        fileUrl,
        status
    }) {
    const {rows} = await pool.query(`
        UPDATE resources
        SET
            week_number = $1,
            title = $2,
            kind = $3,
            size_bytes = $4,
            file_url = $5,
            status = $6
        WHERE id = $7
            AND is_deleted = FALSE
        RETURNING id;
    `, [
        weekNumber,
        title,
        kind,
        sizeBytes,
        fileUrl,
        status,
        resourceId
    ])
        
    return rows[0];
}
