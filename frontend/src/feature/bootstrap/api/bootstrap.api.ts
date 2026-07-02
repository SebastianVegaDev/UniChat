import { apiGet } from "../../../shared/api/client.js";
import type { BootstrapData } from "../../../shared/types/app.types.js";

export async function fetchBootstrapData(): Promise<BootstrapData> {
    return apiGet<BootstrapData>("/bootstrap");
}
