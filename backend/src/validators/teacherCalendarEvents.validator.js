import { BadRequestError } from "../errors/index.js";
import {
    validateDate,
    validateEnum,
    validateOptionalDate,
    validateOptionalString,
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";

const EVENT_TYPES = ["assignment", "exam", "reminder", "announcement", "other"];

function validateCalendarEventFields(body = {}) {
    const startsAt = validateDate(body.startsAt, "Start date");
    const endsAt = validateOptionalDate(body.endsAt, "End date");

    if (endsAt && new Date(endsAt) <= new Date(startsAt)) {
        throw new BadRequestError("End date must be after start date");
    }

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
