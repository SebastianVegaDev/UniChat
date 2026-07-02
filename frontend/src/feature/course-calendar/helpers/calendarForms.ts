import type { FormEvent } from "react";
import type { Course, Dictionary, EntityId } from "../../../shared/types/app.types.js";

export interface CalendarEventPayload extends Dictionary {
    courseId: EntityId;
    calendarEventId?: EntityId | string;
    title: string;
    description: string;
    eventType: string;
    startsAt: string;
    endsAt: string;
}

function getFormString(formData: FormData, name: string): string {
    const value = formData.get(name);

    return typeof value === "string" ? value : "";
}

export function formatDateTimeInput(dateValue?: string): string {
    if (!dateValue) return "";

    return dateValue.slice(0, 16);
}

export function getCalendarEventFormData(
    event: FormEvent<HTMLFormElement>,
    course: Course,
    calendarEvent?: Dictionary
): CalendarEventPayload {
    const formData = new FormData(event.currentTarget);
    const calendarEventId = calendarEvent?.id;

    return {
        courseId: course.id,
        title: getFormString(formData, "title"),
        description: getFormString(formData, "description"),
        eventType: getFormString(formData, "eventType"),
        startsAt: getFormString(formData, "startsAt"),
        endsAt: getFormString(formData, "endsAt"),
        ...(typeof calendarEventId === "number" || typeof calendarEventId === "string" ? { calendarEventId } : {})
    };
}
