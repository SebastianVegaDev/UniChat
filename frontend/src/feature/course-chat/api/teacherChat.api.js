import { apiDelete, apiPatch } from "../../../shared/api/client.js";

export async function fetchToggleTeacherChatChannelLock(channelData) {
    return apiPatch("/teacher/chat/channel/lock", channelData);
}

export async function fetchSetTeacherFixedMessage(messageData) {
    return apiPatch("/teacher/chat/message/fixed", messageData);
}

export async function fetchDeleteTeacherChatMessage(messageData) {
    return apiDelete("/teacher/chat/message/delete", messageData);
}
