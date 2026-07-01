export function buildCourseIndex(...groups) {
    const coursesById = new Map();

    groups.flat().forEach((item) => {
        if (!item?.courseId) return;

        coursesById.set(`${item.courseId}`, {
            courseId: item.courseId,
            courseTitle: item.courseTitle,
            courseShortName: item.courseShortName,
            courseSlug: item.courseSlug
        });
    });

    return [...coursesById.values()];
}