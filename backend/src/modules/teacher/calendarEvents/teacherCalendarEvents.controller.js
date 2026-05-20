import {
    cancelTeacherCalendarEventService,
    createTeacherCalendarEventService,
    deleteTeacherCalendarEventService,
    editTeacherCalendarEventService
} from "./teacherCalendarEvents.service.js"

export async function cancelTeacherCalendarEvent(req, res, next) {
    try {
        const calendarEventId = req.body.calendarEventId;

        const cancelCalendarEvent = await cancelTeacherCalendarEventService(calendarEventId);

        res.json(cancelCalendarEvent)
    } catch (error) {
        next(error)
    }
}

export async function createTeacherCalendarEvent(req, res, next) {
    try {
        const createdById = req.user.id;
        const courseId = req.body.courseId;
        const title = req.body.title;
        const description = req.body.description;
        const eventType = req.body.eventType;
        const startsAt = req.body.startsAt;
        const endsAt = req.body.endsAt;

        const createCalendarEvent = await createTeacherCalendarEventService({
            courseId,
            createdById,
            title,
            description,
            eventType,
            startsAt,
            endsAt
        });

        res.json(createCalendarEvent)
    } catch (error) {
        next(error)
    }
}

export async function deleteTeacherCalendarEvent(req, res, next) {
    try {
        const calendarEventId = req.body.calendarEventId

        const deleteCalendarEvent = await deleteTeacherCalendarEventService(calendarEventId);

        res.json(deleteCalendarEvent)
    } catch (error) {
        next(error)
    }
}

export async function editTeacherCalendarEvent(req, res, next) {
    try {
        const calendarEventId = req.body.calendarEventId
        const title = req.body.title
        const description = req.body.description
        const eventType = req.body.eventType
        const startsAt = req.body.startsAt
        const endsAt = req.body.endsAt

        const editCalendarEvent = await editTeacherCalendarEventService({
            calendarEventId,
            title,
            description,
            eventType,
            startsAt,
            endsAt
        });

        res.json(editCalendarEvent)
    } catch (error) {
        next(error)
    }
}
