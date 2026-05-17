import { getResourcesService } from "./resources.service.js";

export async function getResources(req, res, next) {
    try {
        const userId = req.user.id;

        const resources = await getResourcesService(userId);

        res.json(resources);
    } catch (error) {
        next(error);
    }
}