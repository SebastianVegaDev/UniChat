import { Router } from "express";
import { googleAuth, login, register } from "./auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/google", googleAuth);

export default router;