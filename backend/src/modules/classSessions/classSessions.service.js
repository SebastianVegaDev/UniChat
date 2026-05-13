import { findAllClassSessions } from "./classSessions.repository.js";

export async function getClassSessionsService(userId) {
    return await findAllClassSessions(userId);
}