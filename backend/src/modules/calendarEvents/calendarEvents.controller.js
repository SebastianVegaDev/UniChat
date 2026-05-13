import { getCalendarEventsService } from "./calendarEvents.service.js";

const userId = 1;

export async function getCalendarEvents(req, res, next) {
    try {
        const calendarEvents = await getCalendarEventsService(userId);
        
        res.json(calendarEvents)
    } catch (error) {
        next(error);
    }
}