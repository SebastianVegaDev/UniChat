import { getDateValue, formatDateTimeLabel, isSameCalendarDay } from "../shared/dateFormatter.js";
import { filterByMentionedCourse, getEventDate, getFutureEvents } from "./eventFilters.js";
import { getEventLine } from "./eventAnswer.builder.js";
import type { AiCalendarEvent, AiClassSession } from "../../types/ai.types.js";

export function buildNextClassAnswer(
    classSessions: readonly AiClassSession[],
    events: readonly AiCalendarEvent[],
    question: string
): string {
    const futureSessions = filterByMentionedCourse(classSessions, question)
        .filter((classSession) => {
            const endsAt = getDateValue(classSession.endsAt);
            return endsAt && endsAt >= new Date();
        })
        .sort((firstSession, secondSession) => {
            const firstStart = getDateValue(firstSession.startsAt)?.getTime() ?? 0;
            const secondStart = getDateValue(secondSession.startsAt)?.getTime() ?? 0;

            return firstStart - secondStart;
        });

    const nextSession = futureSessions[0];

    if (!nextSession) {
        return "No veo una proxima clase registrada para ese curso en UniChat.";
    }

    const nextSessionStart = getDateValue(nextSession.startsAt);
    const relatedEvents = getFutureEvents(events)
        .filter((event) => `${event.courseId}` === `${nextSession.courseId}`)
        .filter((event) => {
            const eventDate = getDateValue(getEventDate(event));
            if (!eventDate || !nextSessionStart) return false;

            return eventDate <= nextSessionStart || isSameCalendarDay(eventDate, nextSessionStart);
        })
        .slice(0, 5);

    const answer = [
        `Tu proxima clase de ${nextSession.courseTitle} es ${formatDateTimeLabel(nextSession.startsAt)}.`,
        nextSession.topic ? `Tema: ${nextSession.topic}.` : "",
        nextSession.classroomName ? `Aula: ${nextSession.classroomName}.` : ""
    ].filter(Boolean);

    if (relatedEvents.length === 0) {
        answer.push("No veo tareas, examenes ni recordatorios pendientes antes de esa clase.");
        return answer.join("\n");
    }

    answer.push("Pendiente para esa clase:");
    answer.push(...relatedEvents.map(getEventLine));

    return answer.join("\n");
}
