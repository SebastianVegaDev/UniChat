import { NotFoundError } from "../../../errors/index.js";
import {
    createAdminAnnouncement,
    deleteAdminAnnouncement,
    updateAdminAnnouncement,
    updateAdminAnnouncementStatus
} from "../repositories/adminAnnouncements.repository.js";

export async function createAdminAnnouncementService(data) {
    return await createAdminAnnouncement(data);
}

export async function updateAdminAnnouncementService(announcementId, data) {
    const announcement = await updateAdminAnnouncement(announcementId, data);

    if (!announcement) {
        throw new NotFoundError("Announcement not found");
    }

    return announcement;
}

export async function updateAdminAnnouncementStatusService(announcementId, status) {
    const announcement = await updateAdminAnnouncementStatus(announcementId, status);

    if (!announcement) {
        throw new NotFoundError("Announcement not found");
    }

    return announcement;
}

export async function deleteAdminAnnouncementService(announcementId) {
    const announcement = await deleteAdminAnnouncement(announcementId);

    if (!announcement) {
        throw new NotFoundError("Announcement not found");
    }

    return announcement;
}