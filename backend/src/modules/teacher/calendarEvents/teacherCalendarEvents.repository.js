import { pool } from "../../../config/db.js";

export async function cancelTeacherCalendarEvent({calendarEventId}) {
    const {rows} = await pool.query(`
        UPDATE calendar_events
        SET is_cancelled = TRUE
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING id;
    `, [calendarEventId])

    return rows[0];
}

export async function insertTeacherCalendarEvent(
    {
        courseId,
        createdById,
        title,
        description,
        eventType,
        startsAt,
        endsAt
    }) {
    const {rows} = await pool.query(`
        INSERT INTO
        calendar_events(
            course_id,
            created_by_id,
            title,
            description,
            event_type,
            starts_at,
            ends_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `, [
        courseId,
        createdById,
        title,
        description,
        eventType,
        startsAt,
        endsAt
    ])

    return rows[0];
}

export async function softDeleteTeacherCalendarEvent({calendarEventId}) {
    const {rows} = await pool.query(`
        UPDATE calendar_events
        SET is_deleted = TRUE
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING id;
    `, [calendarEventId])

    return rows[0];
}

export async function updateTeacherCalendarEvent(
    {
        calendarEventId,
        title,
        description,
        eventType,
        startsAt,
        endsAt
    }) {
    const {rows} = await pool.query(`
        UPDATE calendar_events
        SET
            title = $1,
            description = $2,
            event_type = $3,
            starts_at = $4,
            ends_at = $5
        WHERE id = $6
            AND is_deleted = FALSE
        RETURNING id;
    `, [
        title,
        description,
        eventType,
        startsAt,
        endsAt,
        calendarEventId
    ])

    return rows[0];
}
