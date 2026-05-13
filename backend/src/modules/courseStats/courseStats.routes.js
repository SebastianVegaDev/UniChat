import { Router } from "express"
import { getcourseStats } from "./courseStats.controller.js"

const router = Router();

router.get("/", getcourseStats);

export default router;