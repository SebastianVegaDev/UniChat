import { getBootstrapService } from "./bootstrap.service.js";

export async function getBootstrap(req, res, next) {
    try {
        const userId = req.user.id;

        const bootstrap = await getBootstrapService(userId);

        res.json(bootstrap);
    } catch (error) {
        next(error);
    }
}
