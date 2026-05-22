import {
    validateRequiredId,
    validateRequiredString
} from "./common.validator.js";

export function validateSendChatMessage(body = {}) {
    return {
        channelId: validateRequiredId(body.channelId, "Channel id"),
        body: validateRequiredString(body.body, "Message body", 2000)
    };
}

export function validateDeleteChatMessage(body = {}) {
    return {
        messageId: validateRequiredId(body.messageId, "Message id")
    };
}
