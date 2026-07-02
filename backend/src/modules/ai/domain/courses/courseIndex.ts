import type { AiCourseItem } from "../../types/ai.types.js";

export function buildCourseIndex(...groups: Array<readonly AiCourseItem[]>): AiCourseItem[] {
    const coursesById = new Map<string, AiCourseItem>();

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
