import { Router } from "express";
import { getChatChannels, getChatMessages } from "./chat.controller.js";

const router = Router();

router.get("/channels", getChatChannels);
router.get("/messages", getChatMessages);

export default router;