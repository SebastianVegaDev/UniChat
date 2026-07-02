import { getPreviousResolvedContext, getPreviousUserQuestion } from "../conversation/conversationContext.js";
import { findCourseMatch } from "../courses/courseMatcher.js";
import { includesAny, getWordCount } from "../shared/textMatcher.js";
import { normalizeText } from "../shared/textNormalizer.js";
import { FOLLOW_UP_KEYWORDS, FOLLOWABLE_INTENTS } from "./intent.constants.js";
import { detectDirectIntent, getDateFilter, getRequestedWeeks } from "./intent.detector.js";
import type {
    AiCourseItem,
    AiHistoryMessage,
    AiIntent,
    DateFilter,
    FollowableIntent,
    QuestionAnalysis
} from "../../types/ai.types.js";
import type { CourseFilter } from "../../../../shared/types/domain.types.js";

interface InheritIntentInput {
    question: string;
    directIntent: AiIntent | null;
    previousIntent: AiIntent | null;
    courseMatch: CourseFilter | null;
    requestedWeeks: Set<number>;
    dateFilter: DateFilter | null;
}

interface AnalyzeQuestionInput {
    question: string;
    history: readonly AiHistoryMessage[];
    courses?: readonly AiCourseItem[];
}

function isFollowableIntent(intent: AiIntent | null): intent is FollowableIntent {
    return Boolean(intent) && FOLLOWABLE_INTENTS.has(intent as FollowableIntent);
}

export function hasFollowUpSignal(
    question: string,
    courseMatch: CourseFilter | null,
    requestedWeeks: Set<number>,
    dateFilter: DateFilter | null
): boolean {
    const cleanQuestion = normalizeText(question);

    return includesAny(cleanQuestion, FOLLOW_UP_KEYWORDS)
        || Boolean(courseMatch)
        || requestedWeeks.size > 0
        || Boolean(dateFilter);
}

export function shouldInheritIntent({
    question,
    directIntent,
    previousIntent,
    courseMatch,
    requestedWeeks,
    dateFilter
}: InheritIntentInput): boolean {
    if (directIntent || !isFollowableIntent(previousIntent)) return false;

    const cleanQuestion = normalizeText(question);
    const isShort = getWordCount(cleanQuestion) <= 8;
    const hasSignal = hasFollowUpSignal(question, courseMatch, requestedWeeks, dateFilter);

    return isShort && hasSignal;
}

export function analyzeQuestion({ question, history, courses = [] }: AnalyzeQuestionInput): QuestionAnalysis {
    const directIntent = detectDirectIntent(question);
    const previousQuestion = getPreviousUserQuestion(history);
    const previousContext = getPreviousResolvedContext(history);
    const previousIntent = previousContext.intent || (previousQuestion ? detectDirectIntent(previousQuestion) : null);
    const requestedWeeks = getRequestedWeeks(question);
    const previousWeeks = previousQuestion ? getRequestedWeeks(previousQuestion) : new Set<number>();
    const courseMatch = findCourseMatch(courses, question);
    const previousCourseMatch = previousContext.courseFilter
        || (previousQuestion ? findCourseMatch(courses, previousQuestion) : null);
    const dateFilter = getDateFilter(question);
    const shouldUsePreviousIntent = shouldInheritIntent({
        question,
        directIntent,
        previousIntent,
        courseMatch,
        requestedWeeks,
        dateFilter
    });
    const currentIntent: AiIntent = directIntent || (shouldUsePreviousIntent && previousIntent ? previousIntent : "general");
    const weekFilter = requestedWeeks.size > 0
        ? requestedWeeks
        : shouldUsePreviousIntent && currentIntent === "resources"
            ? previousWeeks
            : new Set<number>();

    return {
        currentIntent,
        previousIntent,
        shouldUsePreviousIntent,
        courseFilter: courseMatch || (shouldUsePreviousIntent ? previousCourseMatch : null),
        dateFilter,
        weekFilter
    };
}
