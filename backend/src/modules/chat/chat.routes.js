import { Router } from "express";
import { 
    getChatChannels, 
    getChatMessages, 
    sendChatMessage 
} from "./chat.controller.js";

const router = Router();

router.get("/channels", getChatChannels);
router.get("/messages", getChatMessages);
router.post("/message/send", sendChatMessage);

export default router;
