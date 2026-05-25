import { pool } from "../../config/db.js";

function mapChatChannel(row) {
    return {
        id: row.id,
        courseId: row.courseId,
        name: row.name,
        description: row.description,
        type: row.type,
        isLocked: row.isLocked
    };
}

export async function createAdminCourse(data) {
    const { shortName, title, slug, teacherId, classroomId, secondaryClassroomId, currentWeek } = data;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const { rows } = await client.query(`
            INSERT INTO courses (
                short_name,
                title,
                slug,
                teacher_id,
                classroom_id,
                secondary_classroom_id,
                current_week
            )
            VALUES ($1, $2, $3, $4, NULLIF($5, 0), NULLIF($6, 0), $7)
            RETURNING
                id,
                short_name AS "shortName",
                title,
                slug,
                teacher_id AS "teacherId",
                classroom_id AS "classroomId",
                secondary_classroom_id AS "secondaryClassroomId",
                current_week AS "currentWeek";
        `, [shortName, title, slug, teacherId, classroomId, secondaryClassroomId, currentWeek]);

        const course = rows[0];
        const { rows: channelRows } = await client.query(`
            INSERT INTO chat_channels (
                course_id,
                name,
                description,
                type,
                is_default
            )
            VALUES
                ($1, 'Chat grupal', 'Conversacion general del curso.', 'group', TRUE),
                ($1, 'Anuncios', 'Avisos oficiales del curso.', 'announcement', FALSE)
            RETURNING
                id,
                course_id AS "courseId",
                name,
                description,
                type,
                is_locked AS "isLocked";
        `, [course.id]);

        await client.query("COMMIT");

        return {
            ...course,
            chatChannels: channelRows.map(mapChatChannel)
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function updateAdminCourse(courseId, data) {
    const { teacherId, classroomId, secondaryClassroomId, currentWeek } = data;

    const { rows } = await pool.query(`
        UPDATE courses
        SET teacher_id = $2,
            classroom_id = NULLIF($3, 0),
            secondary_classroom_id = NULLIF($4, 0),
            current_week = $5
        WHERE id = $1
        RETURNING
            id,
            short_name AS "shortName",
            title,
            slug,
            teacher_id AS "teacherId",
            classroom_id AS "classroomId",
            secondary_classroom_id AS "secondaryClassroomId",
            current_week AS "currentWeek";
    `, [courseId, teacherId, classroomId, secondaryClassroomId, currentWeek]);

    return rows[0] ?? null;
}

export async function deleteAdminCourse(courseId) {
    const { rows } = await pool.query(`
        DELETE FROM courses
        WHERE id = $1
        RETURNING id;
    `, [courseId]);

    return rows[0] ?? null;
}

export async function updateAdminUserBlockedStatus({ userId, isBlocked }) {
    const { rows } = await pool.query(`
        UPDATE users
        SET is_blocked = $2
        WHERE id = $1
        RETURNING
            id,
            code,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            role,
            is_blocked AS "isBlocked",
            avatar_url AS "avatarUrl",
            created_at AS "createdAt";
    `, [userId, isBlocked]);

    return rows[0] ?? null;
}

export async function addAdminCourseUserByCode({ courseId, code }) {
    const { rows } = await pool.query(`
        WITH selected_user AS (
            SELECT id
            FROM users
            WHERE code = $2
        )
        INSERT INTO course_members (
            course_id,
            user_id,
            course_role,
            status
        )
        SELECT
            $1,
            selected_user.id,
            'student',
            'active'
        FROM selected_user
        ON CONFLICT (course_id, user_id) DO UPDATE
        SET course_role = 'student',
            status = 'active'
        RETURNING
            id,
            course_id AS "courseId",
            course_role AS "courseRole",
            user_id AS "userId",
            status,
            joined_at AS "joinedAt";
    `, [courseId, code]);

    return rows[0] ?? null;
}

export async function approveAdminDelegate({ courseId, userId }) {
    const { rows } = await pool.query(`
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

export async function rejectAdminDelegate({ courseId, userId }) {
    const { rows } = await pool.query(`
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

export async function createAdminAnnouncement({ title, body, category, status, authorId }) {
    const { rows } = await pool.query(`
        INSERT INTO announcements (
            title,
            body,
            category,
            status,
            author_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            title,
            body,
            category,
            author_id AS "authorId",
            published_at AS "publishedAt",
            status;
    `, [title, body, category, status, authorId]);

    return rows[0];
}

export async function updateAdminAnnouncement(announcementId, data) {
    const { title, body, category, status } = data;

    const { rows } = await pool.query(`
        UPDATE announcements
        SET title = $2,
            body = $3,
            category = $4,
            status = $5,
            published_at = CASE
                WHEN $5 = 'published' THEN NOW()
                ELSE published_at
            END
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING
            id,
            title,
            body,
            category,
            author_id AS "authorId",
            published_at AS "publishedAt",
            status;
    `, [announcementId, title, body, category, status]);

    return rows[0] ?? null;
}

export async function updateAdminAnnouncementStatus(announcementId, status) {
    const { rows } = await pool.query(`
        UPDATE announcements
        SET status = $2,
            published_at = CASE
                WHEN $2 = 'published' THEN NOW()
                ELSE published_at
            END
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING
            id,
            title,
            body,
            category,
            author_id AS "authorId",
            published_at AS "publishedAt",
            status;
    `, [announcementId, status]);

    return rows[0] ?? null;
}

export async function deleteAdminAnnouncement(announcementId) {
    const { rows } = await pool.query(`
        UPDATE announcements
        SET is_deleted = TRUE,
            status = 'archived'
        WHERE id = $1
            AND is_deleted = FALSE
        RETURNING id;
    `, [announcementId]);

    return rows[0] ?? null;
}
