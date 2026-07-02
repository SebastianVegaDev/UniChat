import { apiDelete, apiPatch, apiPost } from "../../../shared/api/client.js";
import type { CalendarEventPayload } from "../helpers/calendarForms.js";
import type { EntityId } from "../../../shared/types/app.types.js";

interface CalendarMutationResponse {
    id: EntityId;
}

export async function fetchCreateCalendarEvent(calendarEventData: CalendarEventPayload): Promise<CalendarMutationResponse> {
    return apiPost<CalendarMutationResponse>("/teacher/calendarEvents/create", calendarEventData);
}

export async function fetchEditCalendarEvent(calendarEventData: CalendarEventPayload): Promise<CalendarMutationResponse> {
    return apiPatch<CalendarMutationResponse>("/teacher/calendarEvents/edit", calendarEventData);
}

export async function fetchCancelCalendarEvent(calendarEventData: Pick<CalendarEventPayload, "calendarEventId">): Promise<CalendarMutationResponse> {
    return apiPatch<CalendarMutationResponse>("/teacher/calendarEvents/cancel", calendarEventData);
}

export async function fetchDeleteCalendarEvent(calendarEventData: Pick<CalendarEventPayload, "calendarEventId">): Promise<CalendarMutationResponse> {
    return apiDelete<CalendarMutationResponse>("/teacher/calendarEvents/delete", calendarEventData);
}
