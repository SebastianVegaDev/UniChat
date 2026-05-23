import { apiDelete, apiPost, apiPatch } from "../../../shared/api/client.js";

export async function fetchSendMessage(messageData) {
    return apiPost("/chat/message/send", messageData);
}

export async function fetchDeleteMessage(messageData) {
    return apiDelete("/chat/message/delete", messageData);
}

export async function fetchToggleMessageReaction(reactionData) {
    return apiPost("/chat/message/reaction", reactionData);
}

export async function fetchMarkChannelAsRead(channelData) {
    return apiPatch("/chat/channel/read", channelData)
}

export async function fetchToggleChatChannelLock(channelData) {
    return apiPatch("/teacher/chat/channel/lock", channelData);
}

export async function fetchSetFixedMessage(messageData) {
    return apiPatch("/teacher/chat/message/fixed", messageData);
}
