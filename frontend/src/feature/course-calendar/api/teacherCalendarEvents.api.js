import { apiDelete, apiPatch, apiPost } from "../../../shared/api/client.js";

export async function fetchCreateTeacherCalendarEvent(calendarEventData) {
    return apiPost("/teacher/calendarEvents/create", calendarEventData);
}

export async function fetchEditTeacherCalendarEvent(calendarEventData) {
    return apiPatch("/teacher/calendarEvents/edit", calendarEventData);
}

export async function fetchCancelTeacherCalendarEvent(calendarEventData) {
    return apiPatch("/teacher/calendarEvents/cancel", calendarEventData);
}

export async function fetchDeleteTeacherCalendarEvent(calendarEventData) {
    return apiDelete("/teacher/calendarEvents/delete", calendarEventData);
}
