import { Router } from "express";
import {
    deleteTeacherResource,
    editTeacherResource,
    toggleTeacherResource,
    uploadTeacherResource,
} from "./teacherResources.controller.js";
import { uploadTeacherResourceFile } from "../../../middlewares/resourceUpload.middleware.js";

const router = Router();

router.post("/upload", uploadTeacherResourceFile, uploadTeacherResource);
router.delete("/delete", deleteTeacherResource);
router.patch("/toggle", toggleTeacherResource);
router.patch("/edit", editTeacherResource);

export default router;
