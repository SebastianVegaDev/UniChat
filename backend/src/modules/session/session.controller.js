import { getSessionService } from "./session.service.js";

export async function getSession(req, res, next) {
    try {
        const userId = req.user.id;

        const session = await getSessionService(userId);

        res.json(session)
    } catch (error) {
        next(error);
    }
}