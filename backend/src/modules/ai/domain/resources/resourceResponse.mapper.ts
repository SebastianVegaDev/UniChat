import type { AiResource, AiResponseResource } from "../../types/ai.types.js";

export function mapResourcesForResponse(resources: readonly AiResource[] = []): AiResponseResource[] {
    return resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        weekNumber: resource.weekNumber,
        kind: resource.kind,
        fileUrl: resource.fileUrl,
        courseTitle: resource.courseTitle
    }));
}
