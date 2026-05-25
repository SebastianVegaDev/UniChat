import { apiPatch } from "../../../shared/api/client.js";

export async function fetchRequestDelegate(delegateData) {
    return apiPatch("/teacher/delegates/request", delegateData);
}
