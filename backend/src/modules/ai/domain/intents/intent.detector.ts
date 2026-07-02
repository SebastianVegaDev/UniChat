import { includesAny, getQuestionTokens, getWordCount } from "../shared/textMatcher.js";
import { normalizeText } from "../shared/textNormalizer.js";
import {
    CHAT_HELP_KEYWORDS,
    EVENT_TYPE_KEYWORDS,
    FAREWELL_KEYWORDS,
    GENERIC_QUERY_WORDS,
    GRATITUDE_KEYWORDS,
    GREETING_KEYWORDS,
    NEXT_CLASS_KEYWORDS,
    PREFERENCE_KEYWORDS,
    RESOURCE_KEYWORDS,
    STUDY_HELP_KEYWORDS
} from "./intent.constants.js";
import type { AiIntent, DateFilter, EventType, QuestionAnalysis } from "../../types/ai.types.js";
import type { CourseFilter } from "../../../../shared/types/domain.types.js";

export function detectDirectIntent(question: string): AiIntent | null {
    const cleanQuestion = normalizeText(question);
    const hasAcademicIntent = includesAny(cleanQuestion, [
        ...EVENT_TYPE_KEYWORDS.assignment,
        ...EVENT_TYPE_KEYWORDS.exam,
        ...RESOURCE_KEYWORDS,
        ...STUDY_HELP_KEYWORDS,
        ...PREFERENCE_KEYWORDS,
        ...CHAT_HELP_KEYWORDS,
        ...NEXT_CLASS_KEYWORDS,
        "calendario",
        "agenda",
        "evento",
        "eventos",
        "pendiente",
        "pendientes"
    ]);
    const canUseSocialIntent = !hasAcademicIntent && getWordCount(cleanQuestion) <= 6;

    if (canUseSocialIntent && includesAny(cleanQuestion, GRATITUDE_KEYWORDS)) return "gratitude";
    if (canUseSocialIntent && includesAny(cleanQuestion, FAREWELL_KEYWORDS)) return "farewell";
    if (canUseSocialIntent && GREETING_KEYWORDS.includes(cleanQuestion)) return "greeting";
    if (includesAny(cleanQuestion, PREFERENCE_KEYWORDS)) return "preferences";
    if (includesAny(cleanQuestion, CHAT_HELP_KEYWORDS)) return "chat_help";
    if (includesAny(cleanQuestion, STUDY_HELP_KEYWORDS)) return "study_help";
    if (includesAny(cleanQuestion, EVENT_TYPE_KEYWORDS.exam)) return "exams";
    if (includesAny(cleanQuestion, EVENT_TYPE_KEYWORDS.assignment)) return "tasks";
    if (includesAny(cleanQuestion, RESOURCE_KEYWORDS)) return "resources";
    if (isNextClassQuestion(question)) return "events";

    const asksCalendar = cleanQuestion.includes("calendario")
        || cleanQuestion.includes("agenda")
        || cleanQuestion.includes("evento")
        || cleanQuestion.includes("eventos")
        || cleanQuestion.includes("que tengo")
        || cleanQuestion.includes("que hay")
        || cleanQuestion.includes("pendiente")
        || cleanQuestion.includes("pendientes");

    if (asksCalendar) return "events";

    return null;
}

export function getDateFilter(question: string): DateFilter | null {
    const cleanQuestion = normalizeText(question);

    if (cleanQuestion.includes("hoy")) return "today";
    if (cleanQuestion.includes("manana") || cleanQuestion.includes("mañana")) return "tomorrow";
    if (cleanQuestion.includes("esta semana") || cleanQuestion.includes("semana")) return "week";
    if (cleanQuestion.includes("este mes") || cleanQuestion.includes("mes")) return "month";

    return null;
}

export function getRequestedEventTypes(question: string): Set<EventType> {
    const cleanQuestion = normalizeText(question);
    const types = new Set<EventType>();

    Object.entries(EVENT_TYPE_KEYWORDS).forEach(([eventType, keywords]) => {
        if (includesAny(cleanQuestion, keywords)) {
            types.add(eventType as EventType);
        }
    });

    if (cleanQuestion.includes("evento") || cleanQuestion.includes("calendario") || cleanQuestion.includes("agenda")) {
        types.clear();
    }

    return types;
}

export function isNextClassQuestion(question: string): boolean {
    return includesAny(normalizeText(question), NEXT_CLASS_KEYWORDS);
}

export function getRequestedWeeks(question: string): Set<number> {
    const cleanQuestion = normalizeText(question);
    const weeks = new Set<number>();
    const weekPattern = /semana\s*(\d+)/g;
    let match = weekPattern.exec(cleanQuestion);

    while (match) {
        weeks.add(Number(match[1]));
        match = weekPattern.exec(cleanQuestion);
    }

    return weeks;
}

export function getSpecificTokens(question: string, analysis: Pick<QuestionAnalysis, "courseFilter">): string[] {
    const keywordTokens = getIntentKeywordTokens();
    const courseTokens = getCourseTokens(analysis.courseFilter);

    return getQuestionTokens(question).filter((token) => {
        return !GENERIC_QUERY_WORDS.has(token)
            && !keywordTokens.has(token)
            && !courseTokens.has(token);
    });
}

function getIntentKeywordTokens(): Set<string> {
    return new Set([
        ...Object.values(EVENT_TYPE_KEYWORDS).flat(),
        ...RESOURCE_KEYWORDS,
        ...STUDY_HELP_KEYWORDS,
        ...PREFERENCE_KEYWORDS,
        ...CHAT_HELP_KEYWORDS,
        ...NEXT_CLASS_KEYWORDS,
        ...GRATITUDE_KEYWORDS,
        ...FAREWELL_KEYWORDS,
        ...GREETING_KEYWORDS,
        "calendario",
        "agenda",
        "evento",
        "eventos",
        "pendiente",
        "pendientes",
        "hoy",
        "manana",
        "mañana",
        "semana",
        "mes"
    ].flatMap((keyword) => normalizeText(keyword).split(/\s+/).filter(Boolean)));
}

function getCourseTokens(courseFilter: CourseFilter | null): Set<string> {
    if (!courseFilter) return new Set();

    return new Set([
        courseFilter.courseTitle,
        courseFilter.courseShortName,
        courseFilter.courseSlug
    ].flatMap((value) => normalizeText(value ?? "").split(/\s+/).filter(Boolean)));
}
