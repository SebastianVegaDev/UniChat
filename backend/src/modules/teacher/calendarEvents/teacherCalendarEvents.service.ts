import { 
    cancelTeacherCalendarEvent,
    insertTeacherCalendarEvent,
    softDeleteTeacherCalendarEvent,
    updateTeacherCalendarEvent
} from "./teacherCalendarEvents.repository.js";
import { NotFoundError } from "../../../errors/index.js";
import { findTeacherCourseAccess, findTeacherCalendarEventAccess } from "../../access/access.repository.js";
import type {
    TeacherCalendarEventEditInput,
    TeacherCalendarEventIdentity,
    TeacherCalendarEventInput,
    TeacherRow
} from "../types/teacher.types.js";

export async function cancelTeacherCalendarEventService({
    calendarEventId,
    teacherId
}: Required<TeacherCalendarEventIdentity>): Promise<TeacherRow | null> {
    const access = await findTeacherCalendarEventAccess({
        teacherId,
        calendarEventId
    });

    if (!access) {
        throw new NotFoundError("Calendar event not found");
    }

    return await cancelTeacherCalendarEvent({calendarEventId});
}

export async function createTeacherCalendarEventService(data: TeacherCalendarEventInput): Promise<TeacherRow> {
    const {
        courseId,
        createdById
    } = data

    const access = await findTeacherCourseAccess({
        teacherId: createdById,
        courseId
    });

    if (!access) {
        throw new NotFoundError("Course not found");
    }

    return await insertTeacherCalendarEvent(data);
}

export async function deleteTeacherCalendarEventService({
    calendarEventId,
    teacherId
}: Required<TeacherCalendarEventIdentity>): Promise<TeacherRow | null> {
    const access = await findTeacherCalendarEventAccess({
        teacherId,
        calendarEventId
    });

    if (!access) {
        throw new NotFoundError("Calendar event not found");
    }

    return await softDeleteTeacherCalendarEvent({calendarEventId});
}

export async function editTeacherCalendarEventService(data: TeacherCalendarEventEditInput): Promise<TeacherRow | null> {
    const {
        calendarEventId,
        teacherId
    } = data

    const access = await findTeacherCalendarEventAccess({
        teacherId,
        calendarEventId
    });

    if (!access) {
        throw new NotFoundError("Calendar event not found");
    }

    return await updateTeacherCalendarEvent(data);
}
