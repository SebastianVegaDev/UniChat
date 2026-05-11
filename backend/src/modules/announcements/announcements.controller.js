import { findAllAnnouncements } from "./announcements.repository.js";

export async function getAnnouncements() {
    return await findAllAnnouncements;
}