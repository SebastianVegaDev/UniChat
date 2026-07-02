import {
    validateBoolean,
    validateRequiredId
} from "./common.validator.js";

export function validateToggleTeacherChatChannelLock(body: Record<string, unknown> = {}) {
    return {
        channelId: validateRequiredId(body.channelId, "Channel id"),
        isLocked: validateBoolean(body.isLocked, "Is locked")
    };
}

export function validateSetTeacherFixedMessage(body: Record<string, unknown> = {}) {
    return {
        messageId: validateRequiredId(body.messageId, "Message id"),
        channelId: validateRequiredId(body.channelId, "Channel id")
    };
}
