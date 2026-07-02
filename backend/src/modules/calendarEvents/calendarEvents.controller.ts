import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getCalendarEventsService } from "./calendarEvents.service.js";

export const getCalendarEvents = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const calendarEvents = await getCalendarEventsService(userId);
    
    res.json(calendarEvents)
});