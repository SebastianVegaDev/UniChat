import {
    cancelTeacherCalendarEventService,
    createTeacherCalendarEventService,
    deleteTeacherCalendarEventService,
    editTeacherCalendarEventService
} from "./teacherCalendarEvents.service.js"
import {
    validateCancelTeacherCalendarEvent,
    validateCreateTeacherCalendarEvent,
    validateDeleteTeacherCalendarEvent,
    validateEditTeacherCalendarEvent
} from "../../../validators/teacherCalendarEvents.validator.js";

export async function cancelTeacherCalendarEvent(req, res, next) {
    try {
        const teacherId = req.user.id;
        const { calendarEventId } = validateCancelTeacherCalendarEvent(req.body);

        const cancelCalendarEvent = await cancelTeacherCalendarEventService({calendarEventId, teacherId});

        res.json(cancelCalendarEvent)
    } catch (error) {
        next(error)
    }
}

export async function createTeacherCalendarEvent(req, res, next) {
    try {
        const createdById = req.user.id;
        const data = validateCreateTeacherCalendarEvent(req.body);

        const createCalendarEvent = await createTeacherCalendarEventService({
            ...data,
            createdById
        });

        res.json(createCalendarEvent)
    } catch (error) {
        next(error)
    }
}

export async function deleteTeacherCalendarEvent(req, res, next) {
    try {
        const teacherId = req.user.id;
        const { calendarEventId } = validateDeleteTeacherCalendarEvent(req.body);

        const deleteCalendarEvent = await deleteTeacherCalendarEventService({calendarEventId, teacherId});

        res.json(deleteCalendarEvent)
    } catch (error) {
        next(error)
    }
}

export async function editTeacherCalendarEvent(req, res, next) {
    try {
        const teacherId = req.user.id;
        const data = validateEditTeacherCalendarEvent(req.body);

        const editCalendarEvent = await editTeacherCalendarEventService({
            ...data,
            teacherId
        });

        res.json(editCalendarEvent)
    } catch (error) {
        next(error)
    }
}
