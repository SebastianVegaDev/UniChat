import {
    deleteTeacherChatMessageService,
    setTeacherFixedMessageService,
    toggleTeacherChatChannelLockService
} from "./teacherChat.service.js"

export async function toggleTeacherChatChannelLock(req, res, next) {
    try {
        const channelId = req.body.channelId;
        const isLocked = req.body.isLocked;

        const toggleChatChannelLock = await toggleTeacherChatChannelLockService({
            channelId,
            isLocked
        });

        res.json(toggleChatChannelLock)
    } catch (error) {
        next(error)
    }
}

export async function deleteTeacherChatMessage(req, res, next) {
    try {
        const messageId = req.body.messageId;

        const deleteChatMessage = await deleteTeacherChatMessageService(messageId);

        res.json(deleteChatMessage)
    } catch (error) {
        next(error)
    }
}

export async function setTeacherFixedMessage(req, res, next) {
    try {
        const messageId = req.body.messageId;
        const channelId = req.body.channelId;

        const setFixedMessage = await setTeacherFixedMessageService({
            messageId,
            channelId
        });

        res.json(setFixedMessage)
    } catch (error) {
        next(error)
    }
}
