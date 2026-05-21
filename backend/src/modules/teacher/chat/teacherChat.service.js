import { 
    softDeleteTeacherChatMessage,
    updateTeacherChatChannelLock,
    updateTeacherFixedMessage
} from "./teacherChat.repository.js";
import { BadRequestError, NotFoundError } from "../../../errors/index.js";

export async function toggleTeacherChatChannelLockService(data) {
    const {
        channelId,
        isLocked
    } = data

    if (!channelId) {
        throw new BadRequestError("Channel id is required");
    }

    if (typeof isLocked !== "boolean") {
        throw new BadRequestError("Channel lock value is required");
    }

    const channel = await updateTeacherChatChannelLock({
        channelId,
        isLocked
    });

    if (!channel) {
        throw new NotFoundError("Chat channel not found");
    }

    return channel;
}

export async function setTeacherFixedMessageService(data) {
    const {
        messageId,
        channelId
    } = data

    if (!messageId || !channelId) {
        throw new BadRequestError("Message data is required");
    }

    const message = await updateTeacherFixedMessage({
        messageId,
        channelId
    });

    if (!message) {
        throw new NotFoundError("Chat message not found");
    }

    return message;
}

export async function deleteTeacherChatMessageService(messageId) {
    if (!messageId) {
        throw new BadRequestError("Message id is required");
    }

    const message = await softDeleteTeacherChatMessage({messageId});

    if (!message) {
        throw new NotFoundError("Chat message not found");
    }

    return message;
}
