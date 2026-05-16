import { getCalendarEventsService } from "./calendarEvents.service.js";

export async function getCalendarEvents(req, res, next) {
    try {
        const userId = req.user.id;

        const calendarEvents = await getCalendarEventsService(userId);
        
        res.json(calendarEvents)
    } catch (error) {
        next(error);
    }
}