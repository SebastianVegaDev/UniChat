import { getClassSessionsService } from "./classSessions.service.js";

const userId = 1;

export async function getClassSessions(req, res, next) {
    try {
        const classSessions = await getClassSessionsService(userId);

        res.json(classSessions)
    } catch (error) {
        next(error);
    }
}