import { findAllChat } from "./chat.repository.js";

export async function getChatService() {
    return await findAllChat();
}