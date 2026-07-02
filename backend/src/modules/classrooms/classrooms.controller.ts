import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getClassroomsService } from "./classrooms.service.js";

export const getClassrooms = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const classrooms = await getClassroomsService(userId);
    res.json(classrooms);
});