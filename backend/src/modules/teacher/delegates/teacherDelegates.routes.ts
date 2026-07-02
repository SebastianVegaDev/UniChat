import { Router } from "express";
import { requestTeacherDelegate } from "./teacherDelegates.controller.js";

const router = Router();

router.patch("/request", requestTeacherDelegate);

export default router;
