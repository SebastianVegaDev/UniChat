import { pool } from "../../../config/db.js";
import type { AdminDelegateActionInput, AdminRow } from "../types/admin.types.js";

export async function approveAdminDelegate({ courseId, userId }: AdminDelegateActionInput): Promise<AdminRow | null> {
    const { rows } = await pool.query<AdminRow>(`
        UPDATE course_members
        SET course_role = 'delegate',
            status = 'active'
        WHERE course_id = $1
            AND user_id = $2
            AND course_role = 'delegate'
            AND status = 'pending_delegate'
        RETURNING
            id,
            course_id AS "courseId",
            course_role AS "courseRole",
            user_id AS "userId",
            status,
            joined_at AS "joinedAt";
    `, [courseId, userId]);

    return rows[0] ?? null;
}

export async function rejectAdminDelegate({ courseId, userId }: AdminDelegateActionInput): Promise<AdminRow | null> {
    const { rows } = await pool.query<AdminRow>(`
        DELETE FROM course_members
        WHERE course_id = $1
            AND user_id = $2
            AND course_role = 'delegate'
            AND status = 'pending_delegate'
        RETURNING
            id,
            course_id AS "courseId",
            course_role AS "courseRole",
            user_id AS "userId",
            status,
            joined_at AS "joinedAt";
    `, [courseId, userId]);

    return rows[0] ?? null;
}
