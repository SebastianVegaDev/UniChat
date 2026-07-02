import { findAllCalendarEvents } from "./calendarEvents.repository.js";
import type { DatabaseRow, EntityId } from "../../shared/types/domain.types.js";

export async function getCalendarEventsService(userId: EntityId): Promise<DatabaseRow[]> {
    return await findAllCalendarEvents(userId);
}
