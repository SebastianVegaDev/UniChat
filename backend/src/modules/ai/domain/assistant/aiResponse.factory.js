export function buildResponse(analysis, payload) {
    return {
        intent: analysis.currentIntent,
        courseFilter: analysis.courseFilter
            ? {
                courseId: analysis.courseFilter.courseId,
                courseTitle: analysis.courseFilter.courseTitle,
                courseShortName: analysis.courseFilter.courseShortName,
                courseSlug: analysis.courseFilter.courseSlug
            }
            : null,
        ...payload
    };
}