import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getClassSessionsService } from "./classSessions.service.js";

export const getClassSessions = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const classSessions = await getClassSessionsService(userId);

    res.json(classSessions)
});