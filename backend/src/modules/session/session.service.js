import { findSession } from "./session.repository.js";

export async function getSessionService(userId) {
    return await findSession(userId)
}