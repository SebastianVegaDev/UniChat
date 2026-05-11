import { findAllResources } from "./resources.repository.js";

export async function getResources() {
    return await findAllResources;
}