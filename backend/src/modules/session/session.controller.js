import { getSessionService } from "./session.service.js";

const userId = 1;

export async function getSession(req, res, next) {
    try {
        const session = await getSessionService(userId);

        res.json(session)
    } catch (error) {
        next(error);
    }
}