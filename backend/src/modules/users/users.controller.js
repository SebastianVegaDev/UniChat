import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getCurrentUserService, getUsersService } from "./users.service.js";

export const getUserss = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const users = await getUsersService(userId);

    res.json(users);
});

export const getCurrentUsers = asyncHandlerr(async (req, res, next) => {
    const userId = req.user.id;

    const user = await getCurrentUserService(userId);

    res.json(user);
});
