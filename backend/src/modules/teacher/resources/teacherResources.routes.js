import { Router } from "express";
import {
    deleteTeacherResource,
    editTeacherResource,
    toggleTeacherResource,
    uploadTeacherResource,
} from "./teacherResources.controller.js";

const router = Router();

router.post("/upload", uploadTeacherResource);
router.delete("/delete", deleteTeacherResource);
router.patch("/toggle", toggleTeacherResource);
router.patch("/edit", editTeacherResource);

export default router;
