import { findAllChat } from "./chat.repository.js";

export async function getChat() {
    return await findAllChat;
}