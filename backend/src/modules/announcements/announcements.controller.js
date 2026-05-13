import { getAnnouncementsService } from "./announcements.service.js";

export async function getAnnouncements(req, res, next) {
    try {
        const announcements = await getAnnouncementsService();

        res.json(announcements)
    } catch (error) {
        next(error);
    }
}