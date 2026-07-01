import { PollyClient } from "@aws-sdk/client-polly";
import { env } from "../../../../config/env.js";

export function createPollyClient() {
    return new PollyClient({
        region: env.aws.region
    });
}