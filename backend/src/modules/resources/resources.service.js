import { findAllResources } from "./resources.repository.js";

export async function getResourcesService() {
    return await findAllResources();
}