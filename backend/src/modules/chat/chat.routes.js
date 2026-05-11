import { Router } from "express";
import { getChat } from "./chat.controller.js";

const router = Router();

router.get("/", getChat);

export default router;