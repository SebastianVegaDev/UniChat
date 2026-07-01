import {
    setTeacherFixedMessageService,
    toggleTeacherChatChannelLockService
} from "./teacherChat.service.js"
import {
    validateSetTeacherFixedMessage,
    validateToggleTeacherChatChannelLock
} from "../../../validators/teacherChat.validator.js";
import { emitToChatChannel } from "../../../socket/socket.js";
import { asyncHandler } from "../../../shared/http/asyncHandler.js";

export const toggleTeacherChatChannelLock = asyncHandler(async (req, res, next) => {
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
});

export const setTeacherFixedMessage = asyncHandler(async (req, res, next) => {
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
});
