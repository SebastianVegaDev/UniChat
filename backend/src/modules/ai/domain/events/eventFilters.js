import { getCourseScore } from "../courses/courseMatcher.js";
import { getRequestedEventTypes } from "../intents/intent.detector.js";
import { getDateValue, sortByDate } from "../shared/dateFormatter.js";
import { normalizeText } from "../shared/textNormalizer.js";

export function filterByMentionedCourse(items, question) {
    const cleanQuestion = normalizeText(question);
    const scoredItems = items.map((item) => ({
        ...item,
        courseScore: getCourseScore(item, cleanQuestion)
    }));
    const bestScore = Math.max(0, ...scoredItems.map((item) => item.courseScore));

    if (bestScore === 0) return items;

    return scoredItems.filter((item) => item.courseScore === bestScore);
}

export function getEventDate(event) {
    return event.eventDate ?? event.startsAt;
}

export function getFutureEvents(events) {
    const now = new Date();

    return events
        .filter((event) => {
            const eventDate = getDateValue(getEventDate(event));
            return eventDate && eventDate >= now;
        })
        .sort((firstEvent, secondEvent) => {
            return sortByDate(
                { eventDate: getEventDate(firstEvent) },
                { eventDate: getEventDate(secondEvent) },
                "eventDate"
            );
        });
}

export function filterByCourseFilter(items, courseFilter) {
    if (!courseFilter?.courseId) return items;

    return items.filter((item) => `${item.courseId}` === `${courseFilter.courseId}`);
}

export function getDateLimit(dateFilter) {
    if (!dateFilter) return null;

    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);

    if (dateFilter === "today") {
        end.setDate(start.getDate() + 1);
    } else if (dateFilter === "tomorrow") {
        start.setDate(start.getDate() + 1);
        end.setDate(start.getDate() + 1);
    } else if (dateFilter === "week") {
        end.setDate(start.getDate() + 7);
    } else if (dateFilter === "month") {
        end.setDate(start.getDate() + 31);
    }

    return { start, end };
}

export function filterByDateFilter(events, dateFilter) {
    const dateLimit = getDateLimit(dateFilter);

    if (!dateLimit) return events;

    return events.filter((event) => {
        const eventDate = getDateValue(getEventDate(event));

        return eventDate && eventDate >= dateLimit.start && eventDate < dateLimit.end;
    });
}

export function getIntentEventTypes(intent, question) {
    if (intent === "exams") return new Set(["exam"]);
    if (intent === "tasks") return new Set(["assignment"]);
    if (intent === "events") return getRequestedEventTypes(question);

    return new Set();
}