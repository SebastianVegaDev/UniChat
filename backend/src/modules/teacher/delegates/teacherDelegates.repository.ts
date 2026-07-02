import { pool } from "../../../config/db.js";
import type { CourseUserInput, TeacherRow } from "../types/teacher.types.js";

export async function findUserByCode(code: string): Promise<TeacherRow | null> {
    const { rows } = await pool.query<TeacherRow>(`
        SELECT
            id,
            code,
            is_blocked AS "isBlocked"
        FROM users
        WHERE code = $1;
    `, [code]);

    return rows[0] ?? null;
}

export async function findCourseMember({ courseId, userId }: CourseUserInput): Promise<TeacherRow | null> {
    const { rows } = await pool.query<TeacherRow>(`
        SELECT
            id,
            course_id AS "courseId",
            course_role AS "courseRole",
            user_id AS "userId",
            status,
            joined_at AS "joinedAt"
        FROM course_members
        WHERE course_id = $1
            AND user_id = $2;
    `, [courseId, userId]);

    return rows[0] ?? null;
}

export async function countCourseDelegates(courseId: number): Promise<number> {
    const { rows } = await pool.query<{ total: number }>(`
        SELECT COUNT(*)::int AS total
        FROM course_members
        WHERE course_id = $1
            AND course_role = 'delegate'
            AND status IN ('active', 'pending_delegate');
    `, [courseId]);

    return rows[0]?.total ?? 0;
}

export async function upsertTeacherDelegateRequest({ courseId, userId }: CourseUserInput): Promise<TeacherRow | null> {
    const { rows } = await pool.query<TeacherRow>(`
        INSERT INTO course_members (
            course_id,
            user_id,
            course_role,
            status
        )
        VALUES ($1, $2, 'delegate', 'pending_delegate')
        ON CONFLICT (course_id, user_id) DO UPDATE
        SET course_role = 'delegate',
            status = CASE
                WHEN course_members.course_role = 'delegate'
                    AND course_members.status = 'active'
                    THEN 'active'
                ELSE 'pending_delegate'
            END
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
