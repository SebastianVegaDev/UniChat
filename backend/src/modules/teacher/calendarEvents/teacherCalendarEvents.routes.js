import { Router } from "express";
import {
    cancelTeacherCalendarEvent,
    createTeacherCalendarEvent,
    deleteTeacherCalendarEvent,
    editTeacherCalendarEvent
} from "./teacherCalendarEvents.controller.js";

const router = Router();

router.post("/create", createTeacherCalendarEvent);
router.patch("/edit", editTeacherCalendarEvent);
router.patch("/cancel", cancelTeacherCalendarEvent);
router.delete("/delete", deleteTeacherCalendarEvent);

export default router;
