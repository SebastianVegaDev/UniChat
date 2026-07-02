import { Router } from "express";
import {
    setTeacherFixedMessage,
    toggleTeacherChatChannelLock
} from "./teacherChat.controller.js";

const router = Router();

router.patch("/channel/lock", toggleTeacherChatChannelLock);
router.patch("/message/fixed", setTeacherFixedMessage);

export default router;
