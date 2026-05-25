import { Router } from "express";
import teacherResourcesRoutes from "./resources/teacherResources.routes.js";
import teacherChatRoutes from "./chat/teacherChat.routes.js";
import teacherCalendarEventsRoutes from "./calendarEvents/teacherCalendarEvents.routes.js";
import teacherDelegatesRoutes from "./delegates/teacherDelegates.routes.js";

const router = Router();

router.use("/resources", teacherResourcesRoutes);
router.use("/chat", teacherChatRoutes);
router.use("/calendarEvents", teacherCalendarEventsRoutes);
router.use("/delegates", teacherDelegatesRoutes);

export default router;
