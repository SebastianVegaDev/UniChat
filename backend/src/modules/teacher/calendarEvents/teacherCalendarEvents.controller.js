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
import { asyncHandler } from "../../../shared/http/asyncHandler.js";

export const cancelTeacherCalendarEvents = asyncHandler(async (req, res, next) => {
    const teacherId = req.user.id;
    const { calendarEventId } = validateCancelTeacherCalendarEvent(req.body);

    const cancelCalendarEvent = await cancelTeacherCalendarEventService({calendarEventId, teacherId});

    res.json(cancelCalendarEvent)
});

export const createTeacherCalendarEvents = asyncHandler(async (req, res, next) => {
    const createdById = req.user.id;
    const data = validateCreateTeacherCalendarEvent(req.body);

    const createCalendarEvent = await createTeacherCalendarEventService({
        ...data,
        createdById
    });

    res.json(createCalendarEvent)
});

export const deleteTeacherCalendarEvents = asyncHandler(async (req, res, next) => {
    const teacherId = req.user.id;
    const { calendarEventId } = validateDeleteTeacherCalendarEvent(req.body);

    const deleteCalendarEvent = await deleteTeacherCalendarEventService({calendarEventId, teacherId});

    res.json(deleteCalendarEvent)
});

export const editTeacherCalendarEvents = asyncHandler(async (req, res, next) => {
    const teacherId = req.user.id;
    const data = validateEditTeacherCalendarEvent(req.body);

    const editCalendarEvent = await editTeacherCalendarEventService({
        ...data,
        teacherId
    });

    res.json(editCalendarEvent)
});
