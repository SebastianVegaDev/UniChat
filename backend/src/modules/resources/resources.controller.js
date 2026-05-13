import { getResourcesService } from "./resources.service.js";

const userId = 1;

export async function getResources(req, res, next) {
    try {
        const resources = await getResourcesService(userId);

        res.json(resources);
    } catch (error) {
        next(error);
    }
}