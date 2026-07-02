import { apiDelete, apiPatch, apiPost } from "../../../shared/api/client.js";

export async function fetchCreateAdminCourse(courseData) {
    return apiPost("/admin/courses", courseData);
}

export async function fetchUpdateAdminCourse(courseId, courseData) {
    return apiPatch(`/admin/courses/${courseId}`, courseData);
}

export async function fetchDeleteAdminCourse(courseId) {
    return apiDelete(`/admin/courses/${courseId}`);
}

export async function fetchAddAdminCourseUser(courseId, code) {
    return apiPost(`/admin/courses/${courseId}/users`, { code });
}

export async function fetchBlockAdminUser(userId) {
    return apiPatch("/admin/users/block", { userId });
}

export async function fetchUnblockAdminUser(userId) {
    return apiPatch("/admin/users/unblock", { userId });
}

export async function fetchApproveAdminDelegate(courseId, userId) {
    return apiPatch("/admin/delegates/approve", { courseId, userId });
}

export async function fetchRejectAdminDelegate(courseId, userId) {
    return apiPatch("/admin/delegates/reject", { courseId, userId });
}

export async function fetchCreateAdminAnnouncement(announcementData) {
    return apiPost("/admin/announcements", announcementData);
}

export async function fetchUpdateAdminAnnouncement(announcementId, announcementData) {
    return apiPatch(`/admin/announcements/${announcementId}`, announcementData);
}

export async function fetchUpdateAdminAnnouncementStatus(announcementId, status) {
    return apiPatch(`/admin/announcements/${announcementId}/status`, { status });
}

export async function fetchDeleteAdminAnnouncement(announcementId) {
    return apiDelete(`/admin/announcements/${announcementId}`);
}
