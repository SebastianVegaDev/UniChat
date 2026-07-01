import { getPreviousResolvedContext, getPreviousUserQuestion } from "../conversation/conversationContext.js";
import { findCourseMatch } from "../courses/courseMatcher.js";
import { includesAny, getWordCount } from "../shared/textMatcher.js";
import { normalizeText } from "../shared/textNormalizer.js";
import { FOLLOW_UP_KEYWORDS, FOLLOWABLE_INTENTS } from "./intent.constants.js";
import { detectDirectIntent, getDateFilter, getRequestedWeeks } from "./intent.detector.js";

export function hasFollowUpSignal(question, courseMatch, requestedWeeks, dateFilter) {
    const cleanQuestion = normalizeText(question);

    return includesAny(cleanQuestion, FOLLOW_UP_KEYWORDS)
        || Boolean(courseMatch)
        || requestedWeeks.size > 0
        || Boolean(dateFilter);
}

export function shouldInheritIntent({ question, directIntent, previousIntent, courseMatch, requestedWeeks, dateFilter }) {
    if (directIntent || !FOLLOWABLE_INTENTS.has(previousIntent)) return false;

    const cleanQuestion = normalizeText(question);
    const isShort = getWordCount(cleanQuestion) <= 8;
    const hasSignal = hasFollowUpSignal(question, courseMatch, requestedWeeks, dateFilter);

    return isShort && hasSignal;
}

export function analyzeQuestion({ question, history, courses = [] }) {
    const directIntent = detectDirectIntent(question);
    const previousQuestion = getPreviousUserQuestion(history);
    const previousContext = getPreviousResolvedContext(history);
    const previousIntent = previousContext.intent || (previousQuestion ? detectDirectIntent(previousQuestion) : null);
    const requestedWeeks = getRequestedWeeks(question);
    const previousWeeks = previousQuestion ? getRequestedWeeks(previousQuestion) : new Set();
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
    const currentIntent = directIntent || (shouldUsePreviousIntent ? previousIntent : "general");
    const weekFilter = requestedWeeks.size > 0
        ? requestedWeeks
        : shouldUsePreviousIntent && currentIntent === "resources"
            ? previousWeeks
            : new Set();

    return {
        currentIntent,
        previousIntent,
        shouldUsePreviousIntent,
        courseFilter: courseMatch || (shouldUsePreviousIntent ? previousCourseMatch : null),
        dateFilter,
        weekFilter
    };
}