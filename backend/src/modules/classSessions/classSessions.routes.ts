import { Router } from "express";
import { getClassSessions } from "./classSessions.controller.js";

const router = Router();

router.get("/", getClassSessions);

export default router;