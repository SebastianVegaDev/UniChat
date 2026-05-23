import { Router } from "express";
import { 
    deleteChatMessage,
    getChatChannels, 
    getChatMessages, 
    markChatChannelAsRead,
    sendChatMessage,
    toggleChatMessageReaction
} from "./chat.controller.js";

const router = Router();

router.get("/channels", getChatChannels);
router.get("/messages", getChatMessages);
router.post("/message/send", sendChatMessage);
router.post("/message/reaction", toggleChatMessageReaction);
router.patch("/channel/read", markChatChannelAsRead)
router.delete("/message/delete", deleteChatMessage);

export default router;
