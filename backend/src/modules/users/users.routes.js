import { Router } from "express";
import { getCurrentUser, getUsers } from "./users.controller.js";

const router = Router();

router.get("/me", getCurrentUser);
router.get("/", getUsers);

export default router;
