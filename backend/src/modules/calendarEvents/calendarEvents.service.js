import { findAllCalendarEvents } from "./calendarEvents.repository.js";

export async function getCalendarEventsService() {
    return await findAllCalendarEvents();
}