import { findAllCalendarEvents } from "./calendarEvents.repository.js";

export async function getCalendarEvents() {
    return await findAllCalendarEvents;
}