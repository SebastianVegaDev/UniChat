import {
    validateEndDateAfterStartDate,
    validateEnum,
    validateOptionalString,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";

const EVENT_TYPES = ["assignment", "exam", "reminder", "announcement", "other"] as const;

function validateCalendarEventFields(body: Record<string, unknown> = {}) {
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

export function validateCreateTeacherCalendarEvent(body: Record<string, unknown> = {}) {
    return {
        courseId: validateRequiredId(body.courseId, "Course id"),
        ...validateCalendarEventFields(body)
    };
}

export function validateEditTeacherCalendarEvent(body: Record<string, unknown> = {}) {
    return {
        calendarEventId: validateRequiredId(body.calendarEventId, "Calendar event id"),
        ...validateCalendarEventFields(body)
    };
}

export function validateCancelTeacherCalendarEvent(body: Record<string, unknown> = {}) {
    return {
        calendarEventId: validateRequiredId(body.calendarEventId, "Calendar event id")
    };
}

export function validateDeleteTeacherCalendarEvent(body: Record<string, unknown> = {}) {
    return {
        calendarEventId: validateRequiredId(body.calendarEventId, "Calendar event id")
    };
}
