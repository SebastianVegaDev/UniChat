import { apiPost } from "../../../shared/api/client.js";

export async function fetchSendMessage(messageData) {
    return apiPost("/chat/message/send", messageData);
}
