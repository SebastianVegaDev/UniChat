import { apiDelete, apiPatch, apiFormPost, apiFormPatch } from "../../../shared/api/client.js";

export async function fetchUploadResource(resourceData) {
    return apiFormPost("/teacher/resources/upload", resourceData);
}

export async function fetchEditResource(resourceData) {
    return apiFormPatch("/teacher/resources/edit", resourceData);
}

export async function fetchToggleResource(resourceData) {
    return apiPatch("/teacher/resources/toggle", resourceData);
}

export async function fetchDeleteResource(resourceData) {
    return apiDelete("/teacher/resources/delete", resourceData);
}
