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

export const cancelTeacherCalendarEvent = asyncHandler(async (req, res) => {
    const teacherId = req.user.id;
    const { calendarEventId } = validateCancelTeacherCalendarEvent(req.body);

    const cancelCalendarEvent = await cancelTeacherCalendarEventService({calendarEventId, teacherId});

    res.json(cancelCalendarEvent)
});

export const createTeacherCalendarEvent = asyncHandler(async (req, res) => {
    const createdById = req.user.id;
    const data = validateCreateTeacherCalendarEvent(req.body);

    const createCalendarEvent = await createTeacherCalendarEventService({
        ...data,
        createdById
    });

    res.json(createCalendarEvent)
});

export const deleteTeacherCalendarEvent = asyncHandler(async (req, res) => {
    const teacherId = req.user.id;
    const { calendarEventId } = validateDeleteTeacherCalendarEvent(req.body);

    const deleteCalendarEvent = await deleteTeacherCalendarEventService({calendarEventId, teacherId});

    res.json(deleteCalendarEvent)
});

export const editTeacherCalendarEvent = asyncHandler(async (req, res) => {
    const teacherId = req.user.id;
    const data = validateEditTeacherCalendarEvent(req.body);

    const editCalendarEvent = await editTeacherCalendarEventService({
        ...data,
        teacherId
    });

    res.json(editCalendarEvent)
});
