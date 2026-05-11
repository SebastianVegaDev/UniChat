import { findAllClassSessions } from "./classSessions.repository.js";

export async function getClassSessions() {
    return await findAllClassSessions;
}