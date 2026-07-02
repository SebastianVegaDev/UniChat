import { Router } from "express";
import { getClassrooms } from "./classrooms.controller.js";

const router = Router();

router.get("/", getClassrooms);

export default router;