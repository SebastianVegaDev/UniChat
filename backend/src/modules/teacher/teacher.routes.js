import { Router } from "express";
import teacherResourcesRoutes from "./resources/teacherResources.routes.js";
import teacherChatRoutes from "./chat/teacherChat.routes.js";
import teacherCalendarEventsRoutes from "./calendarEvents/teacherCalendarEvents.routes.js";

const router = Router();

router.use("/resources", teacherResourcesRoutes);
router.use("/chat", teacherChatRoutes);
router.use("/calendarEvents", teacherCalendarEventsRoutes);

export default router;
