import { apiDelete, apiPatch, apiPost } from "../../../shared/api/client.js";

export async function fetchUploadTeacherResource(resourceData) {
    return apiPost("/teacher/resources/upload", resourceData);
}

export async function fetchEditTeacherResource(resourceData) {
    return apiPatch("/teacher/resources/edit", resourceData);
}

export async function fetchToggleTeacherResource(resourceData) {
    return apiPatch("/teacher/resources/toggle", resourceData);
}

export async function fetchDeleteTeacherResource(resourceData) {
    return apiDelete("/teacher/resources/delete", resourceData);
}
