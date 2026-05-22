import {
    setTeacherFixedMessageService,
    toggleTeacherChatChannelLockService
} from "./teacherChat.service.js"
import {
    validateSetTeacherFixedMessage,
    validateToggleTeacherChatChannelLock
} from "../../../validators/teacherChat.validator.js";

export async function toggleTeacherChatChannelLock(req, res, next) {
    try {
        const teacherId = req.user.id;
        const data = validateToggleTeacherChatChannelLock(req.body);

        const toggleChatChannelLock = await toggleTeacherChatChannelLockService({
            ...data,
            teacherId
        });

        res.json(toggleChatChannelLock)
    } catch (error) {
        next(error)
    }
}

export async function setTeacherFixedMessage(req, res, next) {
    try {
        const teacherId = req.user.id;
        const data = validateSetTeacherFixedMessage(req.body);

        const setFixedMessage = await setTeacherFixedMessageService({
            ...data,
            teacherId
        });

        res.json(setFixedMessage)
    } catch (error) {
        next(error)
    }
}
