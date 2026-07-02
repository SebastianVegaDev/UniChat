import type { PoolClient } from "pg";
import { pool } from "../../config/db.js";
import { createDevSeedData } from "../seeds/devSeed.js";
import type {
    SeedAnnouncement,
    SeedCalendarEvent,
    SeedClassSession,
    SeedClassroom,
    SeedCourse,
    SeedResource,
    SeedUser
} from "../seeds/devSeed.js";
import { isDirectRun, runDatabaseScript } from "./scriptRunner.js";

async function insertUsers(client: PoolClient, users: readonly SeedUser[]): Promise<void> {
    for (const user of users) {
        await client.query(`
            INSERT INTO users (
                code,
                first_name,
                last_name,
                email,
                password_hash,
                role
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (code) DO NOTHING;
        `, [
            user.code,
            user.firstName,
            user.lastName,
            user.email,
            user.passwordHash,
            user.role
        ]);
    }
}

async function insertClassrooms(client: PoolClient, classrooms: readonly SeedClassroom[]): Promise<void> {
    for (const classroom of classrooms) {
        await client.query(`
            INSERT INTO classrooms (
                name,
                type
            )
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
        `, [
            classroom.name,
            classroom.type
        ]);
    }
}

async function insertCourses(client: PoolClient, courses: readonly SeedCourse[]): Promise<void> {
    for (const course of courses) {
        await client.query(`
            INSERT INTO courses (
                short_name,
                title,
                slug,
                teacher_id,
                classroom_id,
                secondary_classroom_id,
                current_week
            )
            SELECT
                $1,
                $2,
                $3,
                teacher.id,
                main_classroom.id,
                secondary_classroom.id,
                $4
            FROM users teacher
            LEFT JOIN classrooms main_classroom
                ON main_classroom.name = $5
            LEFT JOIN classrooms secondary_classroom
                ON secondary_classroom.name = $6
            WHERE teacher.code = $7
            ON CONFLICT (slug) DO NOTHING;
        `, [
            course.shortName,
            course.title,
            course.slug,
            course.currentWeek,
            course.classroomName,
            course.secondaryClassroomName,
            course.teacherCode
        ]);
    }
}

async function insertCourseMembers(client: PoolClient): Promise<void> {
    await client.query(`
        INSERT INTO course_members (
            course_id,
            user_id,
            course_role,
            status
        )
        SELECT
            courses.id,
            users.id,
            'student',
            'active'
        FROM courses
        CROSS JOIN users
        WHERE courses.slug = 'sistemas-operativos'
            AND users.code = '00000003'
        ON CONFLICT (course_id, user_id) DO NOTHING;
    `);
}

async function insertDefaultChatChannels(client: PoolClient): Promise<void> {
    await client.query(`
        INSERT INTO chat_channels (
            course_id,
            name,
            description,
            type,
            is_default
        )
        SELECT
            courses.id,
            'Chat grupal',
            'Conversación general del curso.',
            'group',
            TRUE
        FROM courses
        WHERE courses.slug = 'sistemas-operativos'
        ON CONFLICT DO NOTHING;
    `);

    await client.query(`
        INSERT INTO chat_channels (
            course_id,
            name,
            description,
            type,
            is_default
        )
        SELECT
            courses.id,
            'Anuncios',
            'Avisos oficiales del curso.',
            'announcement',
            FALSE
        FROM courses
        WHERE courses.slug = 'sistemas-operativos'
        ON CONFLICT DO NOTHING;
    `);
}

async function insertResources(client: PoolClient, resources: readonly SeedResource[]): Promise<void> {
    for (const resource of resources) {
        await client.query(`
            INSERT INTO resources (
                course_id,
                week_number,
                title,
                kind,
                size_bytes,
                uploaded_by_id,
                file_url,
                status
            )
            SELECT
                courses.id,
                $1,
                $2,
                $3,
                $4,
                users.id,
                $5,
                'available'
            FROM courses
            LEFT JOIN users
                ON users.code = $6
            WHERE courses.slug = $7;
        `, [
            resource.weekNumber,
            resource.title,
            resource.kind,
            resource.sizeBytes,
            resource.fileUrl,
            resource.uploadedByCode,
            resource.courseSlug
        ]);
    }
}

async function insertCalendarEvents(
    client: PoolClient,
    calendarEvents: readonly SeedCalendarEvent[]
): Promise<void> {
    for (const event of calendarEvents) {
        await client.query(`
            INSERT INTO calendar_events (
                course_id,
                created_by_id,
                title,
                description,
                event_type,
                starts_at,
                ends_at
            )
            SELECT
                courses.id,
                users.id,
                $1,
                $2,
                $3,
                $4,
                $5
            FROM courses
            LEFT JOIN users
                ON users.code = $6
            WHERE courses.slug = $7;
        `, [
            event.title,
            event.description,
            event.eventType,
            event.startsAt,
            event.endsAt,
            event.createdByCode,
            event.courseSlug
        ]);
    }
}

async function insertClassSessions(
    client: PoolClient,
    classSessions: readonly SeedClassSession[]
): Promise<void> {
    for (const classSession of classSessions) {
        await client.query(`
            INSERT INTO class_sessions (
                course_id,
                classroom_id,
                topic,
                starts_at,
                ends_at
            )
            SELECT
                courses.id,
                classrooms.id,
                $1,
                $2,
                $3
            FROM courses
            LEFT JOIN classrooms
                ON classrooms.name = $4
            WHERE courses.slug = $5;
        `, [
            classSession.topic,
            classSession.startsAt,
            classSession.endsAt,
            classSession.classroomName,
            classSession.courseSlug
        ]);
    }
}

async function insertAnnouncements(
    client: PoolClient,
    announcements: readonly SeedAnnouncement[]
): Promise<void> {
    for (const announcement of announcements) {
        await client.query(`
            INSERT INTO announcements (
                title,
                body,
                category,
                author_id,
                status
            )
            SELECT
                $1,
                $2,
                $3,
                users.id,
                $4
            FROM users
            WHERE users.code = $5;
        `, [
            announcement.title,
            announcement.body,
            announcement.category,
            announcement.status,
            announcement.authorCode
        ]);
    }
}

export async function runSeed(): Promise<void> {
    const seed = await createDevSeedData();
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await insertUsers(client, seed.users);
        await insertClassrooms(client, seed.classrooms);
        await insertCourses(client, seed.courses);
        await insertCourseMembers(client);
        await insertDefaultChatChannels(client);
        await insertResources(client, seed.resources);
        await insertCalendarEvents(client, seed.calendarEvents);
        await insertClassSessions(client, seed.classSessions);
        await insertAnnouncements(client, seed.announcements);

        await client.query("COMMIT");

        console.log(`Dev seed inserted. Demo password: ${seed.password}`);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

if (isDirectRun(import.meta.url)) {
    await runDatabaseScript(runSeed);
}
