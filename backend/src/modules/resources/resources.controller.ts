import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getResourcesService } from "./resources.service.js";

export const getResources = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const resources = await getResourcesService(userId);

    res.json(resources);
});