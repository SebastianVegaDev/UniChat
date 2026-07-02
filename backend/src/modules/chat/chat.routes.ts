import { Router } from "express";
import { 
    deleteChatMessage,
    getChatChannels, 
    getChatMessages, 
    markChatChannelAsRead,
    sendChatMessage,
    toggleChatMessageReaction
} from "./chat.controller.js";
import { uploadChatPhoto } from "../../middlewares/chatPhotoUpload.middleware.js";

const router = Router();

router.get("/channels", getChatChannels);
router.get("/messages", getChatMessages);
router.post("/message/send", uploadChatPhoto, sendChatMessage);
router.post("/message/reaction", toggleChatMessageReaction);
router.patch("/channel/read", markChatChannelAsRead)
router.delete("/message/delete", deleteChatMessage);

export default router;
