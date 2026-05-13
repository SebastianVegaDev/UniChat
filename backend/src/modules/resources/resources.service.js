import { findAllResources } from "./resources.repository.js";

export async function getResourcesService(userId) {
    return await findAllResources(userId);
}