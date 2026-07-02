import { includesToken } from "../shared/textMatcher.js";
import { normalizeText } from "../shared/textNormalizer.js";
import type { AiCourseItem } from "../../types/ai.types.js";

export function findCourseMatch<T extends AiCourseItem>(courses: readonly T[], question: string): T | null {
    const cleanQuestion = normalizeText(question);
    const scoredCourses = courses
        .map((course) => ({
            ...course,
            courseScore: getCourseScore(course, cleanQuestion)
        }))
        .filter((course) => course.courseScore > 0)
        .sort((firstCourse, secondCourse) => secondCourse.courseScore - firstCourse.courseScore);

    return scoredCourses[0] ?? null;
}

export function getCourseScore(item: AiCourseItem, cleanQuestion: string): number {
    const courseTitle = normalizeText(item.courseTitle);
    const courseShortName = normalizeText(item.courseShortName);
    let score = 0;

    if (courseTitle && cleanQuestion.includes(courseTitle)) {
        score += 5;
    }

    if (courseShortName && includesToken(cleanQuestion, courseShortName)) {
        score += 4;
    }

    const titleWords = courseTitle
        .split(/\s+/)
        .filter((word) => word.length > 2);

    titleWords.forEach((word) => {
        if (cleanQuestion.includes(word)) {
            score += 1;
        }
    });

    if (courseShortName) {
        const shortWords = courseShortName.split(/\s+/).filter((word) => word.length > 1);
        shortWords.forEach((word) => {
            if (cleanQuestion.includes(word)) {
                score += 0.5;
            }
        });
    }

    return score;
}
