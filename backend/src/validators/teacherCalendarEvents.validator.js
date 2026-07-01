import {
    validateEndDateAfterStartDate,
    validateEnum,
    validateOptionalString,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";

const EVENT_TYPES = ["assignment", "exam", "reminder", "announcement", "other"];

function validateCalendarEventFields(body = {}) {
    const { startsAt, endsAt } = validateEndDateAfterStartDate({
        startsAt: body.startsAt,
        endsAt: body.endsAt
    });

    return {
        title: validateRequiredString(body.title, "Title", 120),
        description: validateOptionalString(body.description, "Description"),
        eventType: validateEnum(body.eventType, "Event type", EVENT_TYPES),
        startsAt,
        endsAt
    };
}

export function validateCreateTeacherCalendarEvent(body = {}) {
    return {
        courseId: validateRequiredId(body.courseId, "Course id"),
        ...validateCalendarEventFields(body)
    };
}

export function validateEditTeacherCalendarEvent(body = {}) {
    return {
        calendarEventId: validateRequiredId(body.calendarEventId, "Calendar event id"),
        ...validateCalendarEventFields(body)
    };
}

export function validateCancelTeacherCalendarEvent(body = {}) {
    return {
        calendarEventId: validateRequiredId(body.calendarEventId, "Calendar event id")
    };
}

export function validateDeleteTeacherCalendarEvent(body = {}) {
    return {
        calendarEventId: validateRequiredId(body.calendarEventId, "Calendar event id")
    };
}