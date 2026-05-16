import { getCurrentUserService, getUsersService } from "./users.service.js";

export async function getUsers(req, res, next) {
    try {
        const userId = req.user.id;

        const users = await getUsersService(userId);

        res.json(users);
    } catch (error) {
        next(error);
    }
}

export async function getCurrentUser(req, res, next) {
    try {
        const userId = req.user.id;

        const user = await getCurrentUserService(userId);

        res.json(user);
    } catch (error) {
        next(error);
    }
}
