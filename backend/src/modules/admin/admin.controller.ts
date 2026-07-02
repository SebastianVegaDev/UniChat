import {
    createAdminCourseService,
    deleteAdminCourseService,
    updateAdminCourseService
} from "./services/adminCourses.service.js";
import {
    addAdminCourseUserService,
    updateAdminUserBlockedStatusService
} from "./services/adminUsers.service.js";
import {
    approveAdminDelegateService,
    rejectAdminDelegateService
} from "./services/adminDelegates.service.js";
import {
    createAdminAnnouncementService,
    deleteAdminAnnouncementService,
    updateAdminAnnouncementService,
    updateAdminAnnouncementStatusService
} from "./services/adminAnnouncements.service.js";
import { asyncHandler } from "../../shared/http/asyncHandler.js";
import {
    validateAdminAnnouncement,
    validateAdminCourse,
    validateAdminCourseSettings,
    validateAdminCourseUser,
    validateAdminDelegateAction,
    validateAdminUserBlock,
    validateAnnouncementStatus
} from "../../validators/admin.validator.js";
import { validateRequiredId } from "../../validators/common.validator.js";

export const createCourse = asyncHandler(async (req, res) => {
    const course = await createAdminCourseService(validateAdminCourse(req.body));

    res.status(201).json(course);
});

export const updateCourse = asyncHandler(async (req, res) => {
    const courseId = validateRequiredId(req.params.courseId, "Course");
    const course = await updateAdminCourseService(courseId, validateAdminCourseSettings(req.body));

    res.json(course);
});

export const deleteCourse = asyncHandler(async (req, res) => {
    const courseId = validateRequiredId(req.params.courseId, "Course");
    const course = await deleteAdminCourseService(courseId);

    res.json(course);
});

export const addCourseUser = asyncHandler(async (req, res) => {
    const courseId = validateRequiredId(req.params.courseId, "Course");
    const { code } = validateAdminCourseUser(req.body);
    const courseMember = await addAdminCourseUserService({ courseId, code });

    res.status(201).json(courseMember);
});

export const blockUser = asyncHandler(async (req, res) => {
    const { userId } = validateAdminUserBlock(req.body, req.user.id);
    const user = await updateAdminUserBlockedStatusService({ userId, isBlocked: true });

    res.json(user);
});

export const unblockUser = asyncHandler(async (req, res) => {
    const { userId } = validateAdminUserBlock(req.body, req.user.id);
    const user = await updateAdminUserBlockedStatusService({ userId, isBlocked: false });

    res.json(user);
});

export const approveDelegate = asyncHandler(async (req, res) => {
    const courseMember = await approveAdminDelegateService(validateAdminDelegateAction(req.body));

    res.json(courseMember);
});

export const rejectDelegate = asyncHandler(async (req, res) => {
    const courseMember = await rejectAdminDelegateService(validateAdminDelegateAction(req.body));

    res.json(courseMember);
});

export const createAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await createAdminAnnouncementService({
        ...validateAdminAnnouncement(req.body),
        authorId: req.user.id
    });

    res.status(201).json(announcement);
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
    const announcementId = validateRequiredId(req.params.announcementId, "Announcement");
    const announcement = await updateAdminAnnouncementService(
        announcementId,
        validateAdminAnnouncement(req.body)
    );

    res.json(announcement);
});

export const updateAnnouncementStatus = asyncHandler(async (req, res) => {
    const announcementId = validateRequiredId(req.params.announcementId, "Announcement");
    const { status } = validateAnnouncementStatus(req.body);
    const announcement = await updateAdminAnnouncementStatusService(announcementId, status);

    res.json(announcement);
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcementId = validateRequiredId(req.params.announcementId, "Announcement");
    const announcement = await deleteAdminAnnouncementService(announcementId);

    res.json(announcement);
});
