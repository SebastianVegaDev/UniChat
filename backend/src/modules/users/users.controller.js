import { getCurrentUserService, getUsersService } from "./users.service.js";

const userId = 1;

export async function getUsers(req, res, next) {
    try {
        const users = await getUsersService(userId);

        res.json(users);
    } catch (error) {
        next(error);
    }
}

export async function getCurrentUser(req, res, next) {
    try {
        const user = await getCurrentUserService(userId);

        res.json(user);
    } catch (error) {
        next(error);
    }
}
