import { apiGet } from "../../../shared/api/client.js";

export async function fetchBootstrapData() {
    return apiGet("/bootstrap");
}