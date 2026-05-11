import { findAllClassSessions } from "./classSessions.repository.js";

export async function getClassSessionsService() {
    return await findAllClassSessions();
}