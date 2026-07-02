import { Router } from "express";
import { getCourseMembers } from "./courseMembers.controller.js";

const router = Router();

router.get("/", getCourseMembers);

export default router;