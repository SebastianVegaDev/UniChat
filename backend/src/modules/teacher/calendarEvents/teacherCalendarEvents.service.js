import { 
    cancelTeacherCalendarEvent,
    insertTeacherCalendarEvent,
    softDeleteTeacherCalendarEvent,
    updateTeacherCalendarEvent
} from "./teacherCalendarEvents.repository.js";
import { NotFoundError } from "../../../errors/index.js";
import { findTeacherCourseAccess, findTeacherCalendarEventAccess } from "../../access/access.repository.js";

export async function cancelTeacherCalendarEventService({calendarEventId, teacherId}) {
    const access = await findTeacherCalendarEventAccess({
        teacherId,
        calendarEventId
    });

    if (!access) {
        throw new NotFoundError("Calendar event not found");
    }

    return await cancelTeacherCalendarEvent({calendarEventId});
}

export async function createTeacherCalendarEventService(data) {
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

export async function deleteTeacherCalendarEventService({calendarEventId, teacherId}) {
    const access = await findTeacherCalendarEventAccess({
        teacherId,
        calendarEventId
    });

    if (!access) {
        throw new NotFoundError("Calendar event not found");
    }

    return await softDeleteTeacherCalendarEvent({calendarEventId});
}

export async function editTeacherCalendarEventService(data) {
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
