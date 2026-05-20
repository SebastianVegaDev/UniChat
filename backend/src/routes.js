import { Router } from "express";

import announcementsRoutes from "./modules/announcements/announcements.routes.js";
import bootstrapRoutes from "./modules/bootstrap/bootstrap.routes.js";
import calendarEventsRoutes from "./modules/calendarEvents/calendarEvents.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import classroomsRoutes from "./modules/classrooms/classrooms.routes.js";
import classSessionsRoutes from "./modules/classSessions/classSessions.routes.js";
import courseMembersRoutes from "./modules/courseMembers/courseMembers.routes.js";
import coursesRoutes from "./modules/courses/courses.routes.js";
import resourcesRoutes from "./modules/resources/resources.routes.js";
import sessionRoutes from "./modules/session/session.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import courseStatsRoutes from "./modules/courseStats/courseStats.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import teacherRoutes from "./modules/teacher/teacher.routes.js";
import { authMiddleware, requireTeacher } from "./middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);

router.use(authMiddleware);

router.use("/announcements", announcementsRoutes);
router.use("/bootstrap", bootstrapRoutes);
router.use("/calendarEvents", calendarEventsRoutes);
router.use("/chat", chatRoutes);
router.use("/classrooms", classroomsRoutes);
router.use("/classSessions", classSessionsRoutes);
router.use("/courseMembers", courseMembersRoutes);
router.use("/courses", coursesRoutes);
router.use("/resources", resourcesRoutes);
router.use("/session", sessionRoutes);
router.use("/users", usersRoutes);
router.use("/courseStats", courseStatsRoutes);

router.use("/teacher", requireTeacher("teacher"), teacherRoutes);

export default router;