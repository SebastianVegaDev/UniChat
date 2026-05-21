import { Router } from "express";
import { 
    deleteChatMessage,
    getChatChannels, 
    getChatMessages, 
    sendChatMessage 
} from "./chat.controller.js";

const router = Router();

router.get("/channels", getChatChannels);
router.get("/messages", getChatMessages);
router.post("/message/send", sendChatMessage);
router.delete("/message/delete", deleteChatMessage);

export default router;
