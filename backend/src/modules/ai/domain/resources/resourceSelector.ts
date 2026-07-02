import { getCourseScore } from "../courses/courseMatcher.js";
import { getRequestedWeeks } from "../intents/intent.detector.js";
import { normalizeText } from "../shared/textNormalizer.js";
import type { AiResource, QuestionAnalysis } from "../../types/ai.types.js";
import type { CourseFilter } from "../../../../shared/types/domain.types.js";

export function getTitleScore(resource: AiResource, cleanQuestion: string): number {
    let titleScore = 0;
    const cleanTitle = normalizeText(resource.title);
    const ignoredWords = new Set(["semana", "recurso", "material"]);

    if (cleanQuestion.includes(cleanTitle)) {
        titleScore += 6;
    }

    cleanTitle.split(/\s+/).forEach((word) => {
        if (word.length > 3 && !ignoredWords.has(word) && cleanQuestion.includes(word)) {
            titleScore += 1;
        }
    });

    return titleScore;
}

export function scoreResource(resource: AiResource, cleanQuestion: string, requestedWeeks: Set<number>): number {
    let score = getTitleScore(resource, cleanQuestion);
    const courseScore = getCourseScore(resource, cleanQuestion);

    if (requestedWeeks.size > 0 && requestedWeeks.has(Number(resource.weekNumber))) {
        score += 4;
    }

    return score + courseScore;
}

export function selectResources(resources: readonly AiResource[], question: string): AiResource[] {
    const cleanQuestion = normalizeText(question);
    const requestedWeeks = getRequestedWeeks(question);
    const weekResources = requestedWeeks.size > 0
        ? resources.filter((resource) => requestedWeeks.has(Number(resource.weekNumber)))
        : [...resources];

    if (weekResources.length === 0) return [];

    const courseMatches = weekResources.map((resource) => ({
        ...resource,
        courseScore: getCourseScore(resource, cleanQuestion)
    }));
    const bestCourseScore = Math.max(...courseMatches.map((resource) => resource.courseScore));
    const courseFilteredResources = bestCourseScore > 0
        ? courseMatches.filter((resource) => resource.courseScore === bestCourseScore)
        : [...weekResources];

    const scoredResources = courseFilteredResources
        .map((resource) => ({
            ...resource,
            titleScore: getTitleScore(resource, cleanQuestion),
            score: scoreResource(resource, cleanQuestion, requestedWeeks)
        }))
        .filter((resource) => resource.score > 0)
        .sort((firstResource, secondResource) => secondResource.score - firstResource.score);

    if (requestedWeeks.size > 0 && bestCourseScore > 0) {
        return scoredResources.slice(0, 3);
    }

    if (requestedWeeks.size > 0 && weekResources.length === requestedWeeks.size) {
        return weekResources.slice(0, 3);
    }

    const matchedByTitle = scoredResources.filter((resource) => resource.titleScore > 0);

    if (requestedWeeks.size > 0 && matchedByTitle.length > 0) {
        return matchedByTitle.slice(0, 3);
    }

    if (requestedWeeks.size > 0 && weekResources.length === 1) {
        return [...weekResources];
    }

    return matchedByTitle.slice(0, 3);
}

export function filterResourcesByAnalysis(
    resources: readonly AiResource[],
    analysis: QuestionAnalysis
): AiResource[] {
    const courseResources = filterResourcesByCourse(resources, analysis.courseFilter);

    if (!analysis.weekFilter || analysis.weekFilter.size === 0) {
        return courseResources;
    }

    return courseResources.filter((resource) => analysis.weekFilter.has(Number(resource.weekNumber)));
}

function filterResourcesByCourse(
    resources: readonly AiResource[],
    courseFilter: CourseFilter | null
): AiResource[] {
    if (!courseFilter?.courseId) return [...resources];

    return resources.filter((resource) => `${resource.courseId}` === `${courseFilter.courseId}`);
}
