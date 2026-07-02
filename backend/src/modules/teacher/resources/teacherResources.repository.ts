import { pool } from "../../../config/db.js";
import type {
    TeacherResourceEditInput,
    TeacherResourceIdentity,
    TeacherResourceInput,
    TeacherRow
} from "../types/teacher.types.js";

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
    }: TeacherResourceInput): Promise<TeacherRow> {
    const {rows} = await pool.query<TeacherRow>(`
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

        RETURNING
            id,
            course_id AS "courseId",
            week_number AS "weekNumber",
            title,
            kind,
            size_bytes AS "sizeBytes",
            uploaded_by_id AS "uploadedById",
            file_url AS "fileUrl",
            file_url AS "url",
            status,
            created_at AS "createdAt";
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

export async function softDeleteTeacherResource({ resourceId }: TeacherResourceIdentity): Promise<TeacherRow | null> {
    const {rows} = await pool.query<TeacherRow>(`
        UPDATE resources
        SET is_deleted = TRUE
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING id;
    `, [resourceId])

    return rows[0];
}

export async function toggleTeacherResourceAvailability({
    status,
    resourceId
}: Pick<TeacherResourceEditInput, "status" | "resourceId">): Promise<TeacherRow | null> {
    const {rows} = await pool.query<TeacherRow>(`
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
    }: TeacherResourceEditInput): Promise<TeacherRow | null> {
    const {rows} = await pool.query<TeacherRow>(`
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
        RETURNING
            id,
            course_id AS "courseId",
            week_number AS "weekNumber",
            title,
            kind,
            size_bytes AS "sizeBytes",
            uploaded_by_id AS "uploadedById",
            file_url AS "fileUrl",
            file_url AS "url",
            status,
            created_at AS "createdAt";
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

export async function findTeacherResourceById({ resourceId }: TeacherResourceIdentity): Promise<TeacherRow | null> {
    const { rows } = await pool.query<TeacherRow>(`
        SELECT
            id,
            file_url AS "fileUrl"
        FROM resources
        WHERE id = $1
            AND is_deleted = FALSE;
    `, [resourceId])

    return rows[0];
}
