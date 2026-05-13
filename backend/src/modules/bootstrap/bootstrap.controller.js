import { getBootstrapService } from "./bootstrap.service.js";

const userId = 1;

export async function getBootstrap(req, res, next) {
    try {
        const bootstrap = await getBootstrapService(userId);

        res.json(bootstrap)
    } catch (error) {
        next(error)
    }
}
