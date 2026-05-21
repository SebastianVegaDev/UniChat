import { 
    cancelTeacherCalendarEvent,
    insertTeacherCalendarEvent,
    softDeleteTeacherCalendarEvent,
    updateTeacherCalendarEvent
} from "./teacherCalendarEvents.repository.js";
import { BadRequestError, NotFoundError } from "../../../errors/index.js";

export async function cancelTeacherCalendarEventService(calendarEventId) {
    return await cancelTeacherCalendarEvent({calendarEventId});
}

export async function createTeacherCalendarEventService(data) {
    const {
        courseId,
        createdById,
        title,
        description,
        eventType,
        startsAt,
        endsAt
    } = data

    return await insertTeacherCalendarEvent({
        courseId,
        createdById,
        title,
        description,
        eventType,
        startsAt,
        endsAt
    });
}

export async function deleteTeacherCalendarEventService(calendarEventId) {
    return await softDeleteTeacherCalendarEvent({calendarEventId});
}

export async function editTeacherCalendarEventService(data) {
    const {
        calendarEventId,
        title,
        description,
        eventType,
        startsAt,
        endsAt
    } = data

    return await updateTeacherCalendarEvent({
        calendarEventId,
        title,
        description,
        eventType,
        startsAt,
        endsAt
    });
}
