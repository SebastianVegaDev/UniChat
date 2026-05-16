import { getClassSessionsService } from "./classSessions.service.js";

export async function getClassSessions(req, res, next) {
    try {
        const userId = req.user.id;

        const classSessions = await getClassSessionsService(userId);

        res.json(classSessions)
    } catch (error) {
        next(error);
    }
}