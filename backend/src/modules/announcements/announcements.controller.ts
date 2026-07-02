import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getAnnouncementsService } from "./announcements.service.js";

export const getAnnouncements = asyncHandler(async (req, res, next) => {
    const announcements = await getAnnouncementsService();

    res.json(announcements)
});