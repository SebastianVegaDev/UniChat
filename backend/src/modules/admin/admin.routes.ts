import { Router } from "express";
import {
    addCourseUser,
    blockUser,
    createAnnouncement,
    createCourse,
    deleteAnnouncement,
    deleteCourse,
    unblockUser,
    updateAnnouncement,
    updateAnnouncementStatus,
    updateCourse,
    approveDelegate,
    rejectDelegate
} from "./admin.controller.js";

const router = Router();

router.post("/courses", createCourse);
router.patch("/courses/:courseId", updateCourse);
router.delete("/courses/:courseId", deleteCourse);
router.post("/courses/:courseId/users", addCourseUser);
router.patch("/delegates/approve", approveDelegate);
router.patch("/delegates/reject", rejectDelegate);
router.patch("/users/block", blockUser);
router.patch("/users/unblock", unblockUser);
router.post("/announcements", createAnnouncement);
router.patch("/announcements/:announcementId", updateAnnouncement);
router.patch("/announcements/:announcementId/status", updateAnnouncementStatus);
router.delete("/announcements/:announcementId", deleteAnnouncement);

export default router;
