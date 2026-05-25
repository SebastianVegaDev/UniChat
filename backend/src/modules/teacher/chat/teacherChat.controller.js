import {
    setTeacherFixedMessageService,
    toggleTeacherChatChannelLockService
} from "./teacherChat.service.js"
import {
    validateSetTeacherFixedMessage,
    validateToggleTeacherChatChannelLock
} from "../../../validators/teacherChat.validator.js";
import { emitToChatChannel } from "../../../socket/socket.js";

export async function toggleTeacherChatChannelLock(req, res, next) {
    try {
        const teacherId = req.user.id;
        const data = validateToggleTeacherChatChannelLock(req.body);

        const toggleChatChannelLock = await toggleTeacherChatChannelLockService({
            ...data,
            teacherId
        });

        emitToChatChannel(toggleChatChannelLock.id, "chat:channel-lock-updated", {
            channelId: toggleChatChannelLock.id,
            isLocked: toggleChatChannelLock.isLocked
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

        emitToChatChannel(data.channelId, "chat:pinned-message-updated", {
            channelId: data.channelId,
            messageId: data.messageId
        });

        res.json(setFixedMessage)
    } catch (error) {
        next(error)
    }
}
