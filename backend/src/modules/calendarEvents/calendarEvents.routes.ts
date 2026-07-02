import { Router } from "express";
import { getCalendarEvents } from "./calendarEvents.controller.js";

const router = Router();

router.get("/", getCalendarEvents);

export default router;