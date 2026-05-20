import { 
    softDeleteTeacherChatMessage,
    updateTeacherChatChannelLock,
    updateTeacherFixedMessage
} from "./teacherChat.repository.js";

export async function toggleTeacherChatChannelLockService(data) {
    const {
        channelId,
        isLocked
    } = data

    return await updateTeacherChatChannelLock({
        channelId,
        isLocked
    });
}

export async function setTeacherFixedMessageService(data) {
    const {
        messageId,
        channelId
    } = data

    return await updateTeacherFixedMessage({
        messageId,
        channelId
    });
}

export async function deleteTeacherChatMessageService(messageId) {
    return await softDeleteTeacherChatMessage({messageId});
}
