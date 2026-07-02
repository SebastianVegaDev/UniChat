import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { getBootstrapService } from "./bootstrap.service.js";

export const getBootstrap = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const bootstrap = await getBootstrapService(userId);

    res.json(bootstrap);
});
