import { findAllAnnouncements } from "./announcements.repository.js";

export async function getAnnouncementsService() {
    return await findAllAnnouncements();
}