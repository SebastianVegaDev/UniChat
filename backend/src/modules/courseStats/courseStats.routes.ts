import { Router } from "express";
import { getCourseStats } from "./courseStats.controller.js";

const router = Router();

router.get("/", getCourseStats);

export default router;
