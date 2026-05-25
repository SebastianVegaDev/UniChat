import { pool } from "../../config/db.js";

export async function findAiAccessibleResources(userId) {
    const { rows } = await pool.query(`
        WITH auth_user AS (
            SELECT role
            FROM users
            WHERE id = $1
        ),
        user_courses AS (
            SELECT id AS course_id
            FROM courses
            WHERE EXISTS (
                SELECT 1
                FROM auth_user
                WHERE role = 'admin'
            )
            UNION
            SELECT course_id
            FROM course_members
            WHERE user_id = $1
                AND status = 'active'
            UNION
            SELECT id AS course_id
            FROM courses
            WHERE teacher_id = $1
        )

        SELECT
            resources.id,
            resources.course_id AS "courseId",
            resources.week_number AS "weekNumber",
            resources.title,
            resources.kind,
            resources.file_url AS "fileUrl",
            courses.title AS "courseTitle",
            courses.short_name AS "courseShortName",
            courses.slug AS "courseSlug",
            resource_definitions.definition,
            resource_definitions.model AS "definitionModel"
        FROM resources
        INNER JOIN courses
            ON courses.id = resources.course_id
        LEFT JOIN resource_definitions
            ON resource_definitions.resource_id = resources.id
        WHERE resources.course_id IN (
            SELECT course_id
            FROM user_courses
        )
            AND resources.is_deleted = FALSE
            AND resources.status = 'available'
        ORDER BY resources.week_number ASC, resources.title ASC;
    `, [userId]);

    return rows;
}

export async function findAiAccessibleCalendarEvents(userId) {
    const { rows } = await pool.query(`
        WITH auth_user AS (
            SELECT role
            FROM users
            WHERE id = $1
        ),
        user_courses AS (
            SELECT id AS course_id
            FROM courses
            WHERE EXISTS (
                SELECT 1
                FROM auth_user
                WHERE role = 'admin'
            )
            UNION
            SELECT course_id
            FROM course_members
            WHERE user_id = $1
                AND status = 'active'
            UNION
            SELECT id AS course_id
            FROM courses
            WHERE teacher_id = $1
        )
        
        SELECT
            calendar_events.id,
            calendar_events.course_id AS "courseId",
            calendar_events.title,
            calendar_events.description,
            calendar_events.starts_at AS "eventDate",
            calendar_events.ends_at AS "endsAt",
            calendar_events.event_type AS "eventType",
            courses.title AS "courseTitle",
            courses.short_name AS "courseShortName",
            courses.slug AS "courseSlug"
        FROM calendar_events
        INNER JOIN courses
            ON courses.id = calendar_events.course_id
        WHERE calendar_events.course_id IN (
            SELECT course_id
            FROM user_courses
        )
            AND calendar_events.is_deleted = FALSE
            AND calendar_events.is_cancelled = FALSE
            AND calendar_events.starts_at >= CURRENT_DATE
        ORDER BY calendar_events.starts_at ASC;
    `, [userId]);

    return rows;
}

export async function findAiAccessibleClassSessions(userId) {
    const { rows } = await pool.query(`
        WITH auth_user AS (
            SELECT role
            FROM users
            WHERE id = $1
        ),
        user_courses AS (
            SELECT id AS course_id
            FROM courses
            WHERE EXISTS (
                SELECT 1
                FROM auth_user
                WHERE role = 'admin'
            )
            UNION
            SELECT course_id
            FROM course_members
            WHERE user_id = $1
                AND status = 'active'
            UNION
            SELECT id AS course_id
            FROM courses
            WHERE teacher_id = $1
        )

        SELECT
            class_sessions.id,
            class_sessions.course_id AS "courseId",
            class_sessions.topic,
            class_sessions.starts_at AS "startsAt",
            class_sessions.ends_at AS "endsAt",
            courses.title AS "courseTitle",
            courses.short_name AS "courseShortName",
            courses.slug AS "courseSlug",
            classrooms.name AS "classroomName"
        FROM class_sessions
        INNER JOIN courses
            ON courses.id = class_sessions.course_id
        LEFT JOIN classrooms
            ON classrooms.id = class_sessions.classroom_id
        WHERE class_sessions.course_id IN (
            SELECT course_id
            FROM user_courses
        )
            AND class_sessions.ends_at >= NOW()
        ORDER BY class_sessions.starts_at ASC;
    `, [userId]);

    return rows;
}

export async function saveResourceDefinition({ resourceId, definition, model }) {
    const { rows } = await pool.query(`
        INSERT INTO resource_definitions (
            resource_id,
            definition,
            model
        )
        VALUES ($1, $2, $3)
        ON CONFLICT (resource_id) DO UPDATE
        SET definition = EXCLUDED.definition,
            model = EXCLUDED.model,
            updated_at = NOW()
        RETURNING
            resource_id AS "resourceId",
            definition,
            model;
    `, [resourceId, definition, model]);

    return rows[0] ?? null;
}
