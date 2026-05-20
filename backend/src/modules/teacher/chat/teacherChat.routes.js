import { Router } from "express";
import {
    deleteTeacherChatMessage,
    setTeacherFixedMessage,
    toggleTeacherChatChannelLock
} from "./teacherChat.controller.js";

const router = Router();

router.patch("/channel/lock", toggleTeacherChatChannelLock);
router.patch("/message/fixed", setTeacherFixedMessage);
router.delete("/message/delete", deleteTeacherChatMessage);

export default router;
