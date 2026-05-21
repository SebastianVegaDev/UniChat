import {
    validateBoolean,
    validateRequiredId
} from "./common.validator.js";

export function validateToggleTeacherChatChannelLock(body = {}) {
    return {
        channelId: validateRequiredId(body.channelId, "Channel id"),
        isLocked: validateBoolean(body.isLocked, "Is locked")
    };
}

export function validateSetTeacherFixedMessage(body = {}) {
    return {
        messageId: validateRequiredId(body.messageId, "Message id"),
        channelId: validateRequiredId(body.channelId, "Channel id")
    };
}
