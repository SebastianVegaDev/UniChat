import { NotFoundError } from "../../../errors/index.js";
import {
    createAdminAnnouncement,
    deleteAdminAnnouncement,
    updateAdminAnnouncement,
    updateAdminAnnouncementStatus
} from "../repositories/adminAnnouncements.repository.js";
import type { EntityId } from "../../../shared/types/domain.types.js";
import type { AdminAnnouncementInput, AdminRow, AnnouncementStatus } from "../types/admin.types.js";

export async function createAdminAnnouncementService(
    data: AdminAnnouncementInput & { authorId: EntityId }
): Promise<AdminRow> {
    return await createAdminAnnouncement(data);
}

export async function updateAdminAnnouncementService(
    announcementId: EntityId,
    data: AdminAnnouncementInput
): Promise<AdminRow> {
    const announcement = await updateAdminAnnouncement(announcementId, data);

    if (!announcement) {
        throw new NotFoundError("Announcement not found");
    }

    return announcement;
}

export async function updateAdminAnnouncementStatusService(
    announcementId: EntityId,
    status: AnnouncementStatus
): Promise<AdminRow> {
    const announcement = await updateAdminAnnouncementStatus(announcementId, status);

    if (!announcement) {
        throw new NotFoundError("Announcement not found");
    }

    return announcement;
}

export async function deleteAdminAnnouncementService(announcementId: EntityId): Promise<AdminRow> {
    const announcement = await deleteAdminAnnouncement(announcementId);

    if (!announcement) {
        throw new NotFoundError("Announcement not found");
    }

    return announcement;
}
