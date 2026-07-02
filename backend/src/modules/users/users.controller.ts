import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getCurrentUserService, getUsersService } from "./users.service.js";

export const getUsers = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const users = await getUsersService(userId);

    res.json(users);
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await getCurrentUserService(userId);

    res.json(user);
});
