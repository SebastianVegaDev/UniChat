import { findAllAnnouncements } from "./announcements.repository.js";
import type { DatabaseRow } from "../../shared/types/domain.types.js";

export async function getAnnouncementsService(): Promise<DatabaseRow[]> {
    return await findAllAnnouncements();
}
