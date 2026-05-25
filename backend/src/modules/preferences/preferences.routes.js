import { Router } from "express";
import {
    getPreferences,
    updatePreferenceWallpaper,
    updatePreferences
} from "./preferences.controller.js";
import { uploadPreferenceWallpaper } from "../../middlewares/preferenceUpload.middleware.js";

const router = Router();

router.get("/", getPreferences);
router.patch("/", uploadPreferenceWallpaper, updatePreferences);
router.patch("/wallpaper", uploadPreferenceWallpaper, updatePreferenceWallpaper);

export default router;
