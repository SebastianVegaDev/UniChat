import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getSessionService } from "./session.service.js";

export const getSession = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const session = await getSessionService(userId);

    res.json(session)
});