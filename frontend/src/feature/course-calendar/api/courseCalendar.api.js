import { apiDelete, apiPatch, apiPost } from "../../../shared/api/client.js";

export async function fetchCreateCalendarEvent(calendarEventData) {
    return apiPost("/teacher/calendarEvents/create", calendarEventData);
}

export async function fetchEditCalendarEvent(calendarEventData) {
    return apiPatch("/teacher/calendarEvents/edit", calendarEventData);
}

export async function fetchCancelCalendarEvent(calendarEventData) {
    return apiPatch("/teacher/calendarEvents/cancel", calendarEventData);
}

export async function fetchDeleteCalendarEvent(calendarEventData) {
    return apiDelete("/teacher/calendarEvents/delete", calendarEventData);
}
