import {
    createAdminAnnouncement,
    createAdminCourse,
    addAdminCourseUserByCode,
    approveAdminDelegate,
    deleteAdminCourse,
    deleteAdminAnnouncement,
    rejectAdminDelegate,
    updateAdminAnnouncement,
    updateAdminAnnouncementStatus,
    updateAdminCourse,
    updateAdminUserBlockedStatus
} from "./admin.repository.js";
import { NotFoundError } from "../../errors/index.js";

export async function createAdminCourseService(data) {
    return await createAdminCourse(data);
}

export async function updateAdminCourseService(courseId, data) {
    const course = await updateAdminCourse(courseId, data);

    if (!course) {
        throw new NotFoundError("Course not found");
    }

    return course;
}

export async function deleteAdminCourseService(courseId) {
    const course = await deleteAdminCourse(courseId);

    if (!course) {
        throw new NotFoundError("Course not found");
    }

    return course;
}

export async function updateAdminUserBlockedStatusService({ userId, isBlocked }) {
    const user = await updateAdminUserBlockedStatus({ userId, isBlocked });

    if (!user) {
        throw new NotFoundError("User not found");
    }

    return user;
}

export async function addAdminCourseUserService({ courseId, code }) {
    const courseMember = await addAdminCourseUserByCode({ courseId, code });

    if (!courseMember) {
        throw new NotFoundError("User not found");
    }

    return courseMember;
}

export async function approveAdminDelegateService(data) {
    const courseMember = await approveAdminDelegate(data);

    if (!courseMember) {
        throw new NotFoundError("Delegate request not found");
    }

    return courseMember;
}

export async function rejectAdminDelegateService(data) {
    const courseMember = await rejectAdminDelegate(data);

    if (!courseMember) {
        throw new NotFoundError("Delegate request not found");
    }

    return courseMember;
}

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
