export function mapResourcesForResponse(resources = []) {
    return resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        weekNumber: resource.weekNumber
    }));
}