import { getSpecificTokens } from "../intents/intent.detector.js";
import { formatDateTimeLabel } from "../shared/dateFormatter.js";
import { getTextMatchScore } from "../shared/textMatcher.js";
import {
    filterByCourseFilter,
    filterByDateFilter,
    getEventDate,
    getFutureEvents,
    getIntentEventTypes
} from "./eventFilters.js";
import { getEventTypeLabel } from "./eventTypes.js";

export function getEventSpecificScore(event, tokens) {
    return getTextMatchScore(event.title, tokens)
        + getTextMatchScore(event.description, tokens)
        + getTextMatchScore(event.courseTitle, tokens)
        + getTextMatchScore(event.courseShortName, tokens);
}

export function getEventLine(event) {
    const eventType = getEventTypeLabel(event.eventType);
    const description = event.description ? ` - ${event.description}` : "";

    return `- ${eventType}: ${event.title} (${event.courseTitle}, ${formatDateTimeLabel(getEventDate(event))})${description}`;
}

export function getShortEventLine(event, includeCourse = true) {
    const title = includeCourse ? `${event.title} - ${event.courseTitle}` : event.title;
    const lines = [
        `- ${title}`,
        `  Fecha: ${formatDateTimeLabel(getEventDate(event))}`
    ];

    if (event.description) {
        lines.push(`  ${event.description}`);
    }

    return lines.join("\n");
}

export function getEmptyEventsAnswer(intent, courseFilter) {
    const courseSuffix = courseFilter ? " en este curso" : "";

    if (intent === "exams") return `No tienes examenes pendientes${courseSuffix}.`;
    if (intent === "tasks") return `No tienes tareas pendientes${courseSuffix}.`;

    return `No veo eventos pendientes${courseSuffix} con los datos actuales.`;
}

export function getSpecificEventsEmptyAnswer(intent) {
    if (intent === "exams") {
        return "No encontre examenes con ese nombre o curso en UniChat. Revisa que este bien escrito y vuelve a preguntar, por ejemplo: \"examen de Sistemas Operativos\".";
    }

    if (intent === "tasks") {
        return "No encontre tareas con ese nombre o curso en UniChat. Revisa que este bien escrito y vuelve a preguntar, por ejemplo: \"tareas de Programacion II\".";
    }

    return "No encontre eventos con ese nombre o curso en UniChat. Revisa que este bien escrito y vuelve a preguntar.";
}

export function getEventsAnswerTitle(intent, events, courseFilter) {
    const courseLabel = courseFilter?.courseTitle ? ` en ${courseFilter.courseTitle}` : "";
    const count = events.length;

    if (intent === "exams") return `Tienes ${count} ${count === 1 ? "examen pendiente" : "examenes pendientes"}${courseLabel}:`;
    if (intent === "tasks") return `Tienes ${count} ${count === 1 ? "tarea pendiente" : "tareas pendientes"}${courseLabel}:`;

    return `Estos son tus proximos eventos${courseLabel}:`;
}

export function buildEventsAnswer(events, question, analysis) {
    const requestedTypes = getIntentEventTypes(analysis.currentIntent, question);
    const scopedEvents = filterByDateFilter(
        filterByCourseFilter(getFutureEvents(events), analysis.courseFilter),
        analysis.dateFilter
    );
    const typedEvents = requestedTypes.size > 0
        ? scopedEvents.filter((event) => requestedTypes.has(event.eventType))
        : scopedEvents;
    const specificTokens = getSpecificTokens(question, analysis);
    const filteredEvents = specificTokens.length > 0
        ? typedEvents
            .map((event) => ({
                ...event,
                specificScore: getEventSpecificScore(event, specificTokens)
            }))
            .filter((event) => event.specificScore > 0)
        : typedEvents;

    if (filteredEvents.length === 0) {
        if (analysis.courseFilter && typedEvents.length > 0) {
            const title = getEventsAnswerTitle(analysis.currentIntent, typedEvents, analysis.courseFilter);
            const includeCourse = false;
            const limit = analysis.currentIntent === "events" ? 5 : 3;
            const lines = typedEvents.slice(0, limit).map((event) => getShortEventLine(event, includeCourse));
            const extraCount = typedEvents.length - lines.length;

            if (extraCount > 0) {
                lines.push(`- Y ${extraCount} mas.`);
            }

            return [title, ...lines].join("\n");
        }

        if (specificTokens.length > 0) {
            return getSpecificEventsEmptyAnswer(analysis.currentIntent);
        }

        return getEmptyEventsAnswer(analysis.currentIntent, analysis.courseFilter);
    }

    const title = getEventsAnswerTitle(analysis.currentIntent, filteredEvents, analysis.courseFilter);
    const includeCourse = !analysis.courseFilter;
    const limit = analysis.currentIntent === "events" ? 5 : 3;
    const lines = filteredEvents.slice(0, limit).map((event) => getShortEventLine(event, includeCourse));
    const extraCount = filteredEvents.length - lines.length;

    if (extraCount > 0) {
        lines.push(`- Y ${extraCount} mas.`);
    }

    return [title, ...lines].join("\n");
}