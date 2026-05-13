import { findAllCalendarEvents } from "./calendarEvents.repository.js";

export async function getCalendarEventsService(userId) {
    return await findAllCalendarEvents(userId);
}