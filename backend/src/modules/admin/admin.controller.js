import {
    createAdminAnnouncementService,
    createAdminCourseService,
    addAdminCourseUserService,
    approveAdminDelegateService,
    deleteAdminAnnouncementService,
    deleteAdminCourseService,
    rejectAdminDelegateService,
    updateAdminUserBlockedStatusService,
    updateAdminAnnouncementService,
    updateAdminAnnouncementStatusService,
    updateAdminCourseService
} from "./admin.service.js";
import {
    validateAdminAnnouncement,
    validateAdminCourseUser,
    validateAdminCourse,
    validateAdminCourseSettings,
    validateAdminDelegateAction,
    validateAdminUserBlock,
    validateAdminUserId,
    validateAnnouncementStatus
} from "../../validators/admin.validator.js";
import { validateRequiredId } from "../../validators/common.validator.js";

export async function createCourse(req, res, next) {
    try {
        const courseData = validateAdminCourse(req.body);
        const course = await createAdminCourseService(courseData);

        res.status(201).json(course);
    } catch (error) {
        next(error);
    }
}

export async function updateCourse(req, res, next) {
    try {
        const courseId = validateRequiredId(req.params.courseId, "Course");
        const courseData = validateAdminCourseSettings(req.body);
        const course = await updateAdminCourseService(courseId, courseData);

        res.json(course);
    } catch (error) {
        next(error);
    }
}

export async function deleteCourse(req, res, next) {
    try {
        const courseId = validateRequiredId(req.params.courseId, "Course");
        const course = await deleteAdminCourseService(courseId);

        res.json(course);
    } catch (error) {
        next(error);
    }
}

export async function blockUser(req, res, next) {
    try {
        const { userId } = validateAdminUserBlock(req.body, req.user.id);
        const user = await updateAdminUserBlockedStatusService({ userId, isBlocked: true });

        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function unblockUser(req, res, next) {
    try {
        const { userId } = validateAdminUserId(req.body);
        const user = await updateAdminUserBlockedStatusService({ userId, isBlocked: false });

        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function addCourseUser(req, res, next) {
    try {
        const courseId = validateRequiredId(req.params.courseId, "Course");
        const { code } = validateAdminCourseUser(req.body);
        const courseMember = await addAdminCourseUserService({ courseId, code });

        res.status(201).json(courseMember);
    } catch (error) {
        next(error);
    }
}

export async function approveDelegate(req, res, next) {
    try {
        const data = validateAdminDelegateAction(req.body);
        const courseMember = await approveAdminDelegateService(data);

        res.json(courseMember);
    } catch (error) {
        next(error);
    }
}

export async function rejectDelegate(req, res, next) {
    try {
        const data = validateAdminDelegateAction(req.body);
        const courseMember = await rejectAdminDelegateService(data);

        res.json(courseMember);
    } catch (error) {
        next(error);
    }
}

export async function createAnnouncement(req, res, next) {
    try {
        const announcementData = validateAdminAnnouncement(req.body);
        const announcement = await createAdminAnnouncementService({
            ...announcementData,
            authorId: req.user.id
        });

        res.status(201).json(announcement);
    } catch (error) {
        next(error);
    }
}

export async function updateAnnouncement(req, res, next) {
    try {
        const announcementId = validateRequiredId(req.params.announcementId, "Announcement");
        const announcementData = validateAdminAnnouncement(req.body);
        const announcement = await updateAdminAnnouncementService(announcementId, announcementData);

        res.json(announcement);
    } catch (error) {
        next(error);
    }
}

export async function updateAnnouncementStatus(req, res, next) {
    try {
        const announcementId = validateRequiredId(req.params.announcementId, "Announcement");
        const { status } = validateAnnouncementStatus(req.body);
        const announcement = await updateAdminAnnouncementStatusService(announcementId, status);

        res.json(announcement);
    } catch (error) {
        next(error);
    }
}

export async function deleteAnnouncement(req, res, next) {
    try {
        const announcementId = validateRequiredId(req.params.announcementId, "Announcement");
        const announcement = await deleteAdminAnnouncementService(announcementId);

        res.json(announcement);
    } catch (error) {
        next(error);
    }
}
