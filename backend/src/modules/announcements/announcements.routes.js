import { Router } from "express";
import { getAnnouncements } from "./announcements.controller.js";

const router = Router();

router.get("/", getAnnouncements);

export default router;