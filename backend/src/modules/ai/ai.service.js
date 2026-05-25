import { askOpenAi } from "./ai.client.js";
import {
    findAiAccessibleResources,
    findAiAccessibleCalendarEvents,
    findAiAccessibleClassSessions,
    saveResourceDefinition
} from "./ai.repository.js";

function normalizeText(value = "") {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

const EVENT_TYPE_LABELS = {
    assignment: "Tarea",
    exam: "Examen",
    reminder: "Recordatorio",
    announcement: "Anuncio",
    other: "Evento"
};

const EVENT_TYPE_KEYWORDS = {
    assignment: ["tarea", "tareas", "trabajo", "trabajos", "entrega", "entregas", "proyecto"],
    exam: ["examen", "examenes", "parcial", "final", "practica calificada", "pc", "evaluacion", "evaluaciones", "quiz", "quizzes"],
    reminder: ["recordatorio", "recordatorios", "recordar"],
    announcement: ["anuncio", "anuncios", "aviso", "avisos", "comunicado"]
};

const NEXT_CLASS_KEYWORDS = [
    "proxima clase",
    "proximo curso",
    "siguiente clase",
    "siguiente sesion",
    "clase siguiente",
    "para la clase",
    "para mi clase"
];

const RESOURCE_KEYWORDS = [
    "recurso",
    "recursos",
    "pdf",
    "pdfs",
    "archivo",
    "archivos",
    "material",
    "materiales",
    "diapositiva",
    "diapositivas"
];

const STUDY_HELP_KEYWORDS = [
    "explica",
    "explicame",
    "ensename",
    "ayudame a entender",
    "que es",
    "como funciona",
    "resumen de",
    "estudiar",
    "repasar"
];

const PREFERENCE_KEYWORDS = [
    "preferencia",
    "preferencias",
    "configuracion",
    "color",
    "colores",
    "paleta",
    "fondo",
    "wallpaper",
    "idioma",
    "tamano de texto",
    "tamaño de texto"
];

const CHAT_HELP_KEYWORDS = [
    "chat",
    "mensaje",
    "mensajes",
    "fijado",
    "fijar",
    "reaccion",
    "reacciones",
    "canal"
];

const GRATITUDE_KEYWORDS = [
    "gracias",
    "muchas gracias",
    "thanks",
    "thank you",
    "te agradezco"
];

const FAREWELL_KEYWORDS = [
    "adios",
    "adiós",
    "chau",
    "chao",
    "hasta luego",
    "nos vemos",
    "bye"
];

const GREETING_KEYWORDS = [
    "hola",
    "buenas",
    "buenos dias",
    "buenos días",
    "buenas tardes",
    "buenas noches"
];

const FOLLOW_UP_KEYWORDS = [
    "y en",
    "solo",
    "tambien",
    "también",
    "mas especifico",
    "más especifico",
    "mas específico",
    "más específico",
    "ahora",
    "ese curso",
    "este curso"
];

const FOLLOWABLE_INTENTS = new Set(["exams", "tasks", "events", "resources"]);

const GENERIC_QUERY_WORDS = new Set([
    "a",
    "al",
    "algo",
    "algun",
    "alguna",
    "algunos",
    "algunas",
    "con",
    "cual",
    "cuales",
    "cuando",
    "de",
    "del",
    "dime",
    "donde",
    "el",
    "en",
    "es",
    "esta",
    "este",
    "fecha",
    "hay",
    "la",
    "las",
    "lo",
    "los",
    "mes",
    "mi",
    "mis",
    "para",
    "pendiente",
    "pendientes",
    "por",
    "que",
    "se",
    "su",
    "sus",
    "tal",
    "tengo",
    "tienes",
    "tu",
    "tus",
    "un",
    "una",
    "universidad",
    "clase"
]);

function includesAny(cleanQuestion, keywords) {
    return keywords.some((keyword) => cleanQuestion.includes(keyword));
}

function includesToken(cleanQuestion, token) {
    if (!token) return false;

    return cleanQuestion
        .split(/\s+/)
        .filter(Boolean)
        .includes(token);
}

function getWordCount(cleanQuestion) {
    return cleanQuestion.split(/\s+/).filter(Boolean).length;
}

function detectDirectIntent(question) {
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

function getPreviousUserQuestion(history = []) {
    const previousUserMessage = [...history]
        .reverse()
        .find((message) => message.type === "user" && message.body);

    return previousUserMessage?.body ?? "";
}

function getPreviousResolvedContext(history = []) {
    const previousBotMessage = [...history]
        .reverse()
        .find((message) => message.type === "bot" && FOLLOWABLE_INTENTS.has(message.intent));

    if (!previousBotMessage) {
        return {
            intent: null,
            courseFilter: null
        };
    }

    return {
        intent: previousBotMessage.intent,
        courseFilter: previousBotMessage.courseFilter ?? null
    };
}

function buildCourseIndex(...groups) {
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

function findCourseMatch(courses, question) {
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

function getQuestionTokens(question) {
    return normalizeText(question)
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2);
}

function getSpecificTokens(question, analysis) {
    const intentWords = [
        ...EVENT_TYPE_KEYWORDS.assignment,
        ...EVENT_TYPE_KEYWORDS.exam,
        ...RESOURCE_KEYWORDS,
        ...FOLLOW_UP_KEYWORDS,
        ...GRATITUDE_KEYWORDS,
        ...FAREWELL_KEYWORDS,
        ...GREETING_KEYWORDS,
        "evento",
        "eventos",
        "calendario",
        "agenda",
        "hoy",
        "manana",
        "mañana",
        "semana"
    ].map(normalizeText);
    const ignoredWords = new Set([...GENERIC_QUERY_WORDS, ...intentWords]);
    const courseWords = [
        analysis.courseFilter?.courseTitle,
        analysis.courseFilter?.courseShortName,
        analysis.courseFilter?.courseSlug
    ]
        .filter(Boolean)
        .flatMap(getQuestionTokens);

    courseWords.forEach((word) => ignoredWords.add(word));

    return getQuestionTokens(question).filter((word) => !ignoredWords.has(word));
}

function getTextMatchScore(value, tokens) {
    const cleanValue = normalizeText(value ?? "");

    return tokens.reduce((score, token) => {
        return cleanValue.includes(token) ? score + 1 : score;
    }, 0);
}

function getEventSpecificScore(event, tokens) {
    return getTextMatchScore(event.title, tokens)
        + getTextMatchScore(event.description, tokens)
        + getTextMatchScore(event.courseTitle, tokens)
        + getTextMatchScore(event.courseShortName, tokens);
}

function getDateFilter(question) {
    const cleanQuestion = normalizeText(question);

    if (cleanQuestion.includes("hoy")) return "today";
    if (cleanQuestion.includes("manana") || cleanQuestion.includes("mañana")) return "tomorrow";
    if (cleanQuestion.includes("esta semana") || cleanQuestion.includes("semana")) return "week";
    if (cleanQuestion.includes("este mes") || cleanQuestion.includes("mes")) return "month";

    return null;
}

function hasFollowUpSignal(question, courseMatch, requestedWeeks, dateFilter) {
    const cleanQuestion = normalizeText(question);

    return includesAny(cleanQuestion, FOLLOW_UP_KEYWORDS)
        || Boolean(courseMatch)
        || requestedWeeks.size > 0
        || Boolean(dateFilter);
}

function shouldInheritIntent({ question, directIntent, previousIntent, courseMatch, requestedWeeks, dateFilter }) {
    if (directIntent || !FOLLOWABLE_INTENTS.has(previousIntent)) return false;

    const cleanQuestion = normalizeText(question);
    const isShort = getWordCount(cleanQuestion) <= 8;
    const hasSignal = hasFollowUpSignal(question, courseMatch, requestedWeeks, dateFilter);

    return isShort && hasSignal;
}

function analyzeQuestion({ question, history, resources, events, classSessions }) {
    const courses = buildCourseIndex(resources, events, classSessions);
    const directIntent = detectDirectIntent(question);
    const previousQuestion = getPreviousUserQuestion(history);
    const previousContext = getPreviousResolvedContext(history);
    const previousIntent = previousContext.intent || (previousQuestion ? detectDirectIntent(previousQuestion) : null);
    const requestedWeeks = getRequestedWeeks(question);
    const previousWeeks = previousQuestion ? getRequestedWeeks(previousQuestion) : new Set();
    const courseMatch = findCourseMatch(courses, question);
    const previousCourseMatch = previousContext.courseFilter || (previousQuestion ? findCourseMatch(courses, previousQuestion) : null);
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

function getEventTypeLabel(eventType) {
    return EVENT_TYPE_LABELS[eventType] ?? EVENT_TYPE_LABELS.other;
}

function getRequestedEventTypes(question) {
    const cleanQuestion = normalizeText(question);
    const types = new Set();

    Object.entries(EVENT_TYPE_KEYWORDS).forEach(([eventType, keywords]) => {
        if (includesAny(cleanQuestion, keywords)) {
            types.add(eventType);
        }
    });

    if (cleanQuestion.includes("evento") || cleanQuestion.includes("calendario") || cleanQuestion.includes("agenda")) {
        types.clear();
    }

    return types;
}

function isNextClassQuestion(question) {
    return includesAny(normalizeText(question), NEXT_CLASS_KEYWORDS);
}

function getDateValue(value) {
    const date = value ? new Date(value) : null;

    if (!date || Number.isNaN(date.getTime())) return null;

    return date;
}

function formatDateTimeLabel(value) {
    const date = getDateValue(value);

    if (!date) return "fecha por confirmar";

    return date.toLocaleString("es-PE", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function isSameCalendarDay(firstValue, secondValue) {
    const firstDate = getDateValue(firstValue);
    const secondDate = getDateValue(secondValue);

    if (!firstDate || !secondDate) return false;

    return firstDate.getFullYear() === secondDate.getFullYear()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getDate() === secondDate.getDate();
}

function sortByDate(firstItem, secondItem, dateKey) {
    const firstDate = getDateValue(firstItem[dateKey])?.getTime() ?? 0;
    const secondDate = getDateValue(secondItem[dateKey])?.getTime() ?? 0;

    return firstDate - secondDate;
}

function getRequestedWeeks(question) {
    const cleanQuestion = normalizeText(question);
    const weeks = new Set();
    const weekPattern = /semana\s*(\d+)/g;
    let match = weekPattern.exec(cleanQuestion);

    while (match) {
        weeks.add(Number(match[1]));
        match = weekPattern.exec(cleanQuestion);
    }

    return weeks;
}

function getTitleScore(resource, cleanQuestion) {
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

function getCourseScore(resource, cleanQuestion) {
    const courseTitle = normalizeText(resource.courseTitle);
    const courseShortName = normalizeText(resource.courseShortName);
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

function scoreResource(resource, cleanQuestion, requestedWeeks) {
    let score = getTitleScore(resource, cleanQuestion);
    const courseScore = getCourseScore(resource, cleanQuestion);

    if (requestedWeeks.size > 0 && requestedWeeks.has(Number(resource.weekNumber))) {
        score += 4;
    }

    return score + courseScore;
}

function selectResources(resources, question) {
    const cleanQuestion = normalizeText(question);
    const requestedWeeks = getRequestedWeeks(question);
    const weekResources = requestedWeeks.size > 0
        ? resources.filter((resource) => requestedWeeks.has(Number(resource.weekNumber)))
        : resources;

    if (weekResources.length === 0) return [];

    const courseMatches = weekResources.map((resource) => ({
        ...resource,
        courseScore: getCourseScore(resource, cleanQuestion)
    }));
    const bestCourseScore = Math.max(...courseMatches.map((resource) => resource.courseScore));
    const courseFilteredResources = bestCourseScore > 0
        ? courseMatches.filter((resource) => resource.courseScore === bestCourseScore)
        : weekResources;

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
        return weekResources;
    }

    return matchedByTitle.slice(0, 3);
}

function getResourceInfo(resource) {
    return [
        `Curso: ${resource.courseTitle}`,
        `Semana: ${resource.weekNumber}`,
        `Recurso: ${resource.title}`,
        `Tipo: ${resource.kind}`,
        `Archivo: ${resource.fileUrl}`
    ].join("\n");
}

function buildFallbackDefinition(resource) {
    return [
        `El recurso "${resource.title}" pertenece al curso "${resource.courseTitle}" y a la semana ${resource.weekNumber}.`,
        `Es un material de tipo ${resource.kind}.`,
        "Todavia no tiene una definicion generada con IA porque falta configurar OPENAI_API_KEY."
    ].join(" ");
}

async function getOrCreateDefinition(resource) {
    const hasBadFallback = resource.definition?.includes("falta configurar OPENAI_API_KEY");

    if (resource.definition && !hasBadFallback && resource.definitionModel !== "local-fallback") {
        return resource.definition;
    }

    const result = await askOpenAi({
        maxOutputTokens: 260,
        instructions: [
            "Eres un asistente academico de UniChat.",
            "Crea una definicion clara y reutilizable del recurso para estudiantes nuevos.",
            "Usa solo la metadata enviada. No inventes contenido que no aparece.",
            "Incluye para que sirve, tema probable, curso y semana.",
            "Respuesta en espanol, breve y facil de entender."
        ].join(" "),
        input: getResourceInfo(resource)
    }).catch(() => null);

    const definition = result?.text || buildFallbackDefinition(resource);

    await saveResourceDefinition({
        resourceId: resource.id,
        definition,
        model: result?.text ? result.model : "local-fallback"
    });

    return definition;
}

function buildDefinitionsContext(resources, definitions) {
    if (resources.length === 0) return "";

    const resourcesContext = resources.map((resource, index) => {
        return [
            `${resource.title} (Semana ${resource.weekNumber})`,
            `Curso: ${resource.courseTitle}`,
            `Resumen: ${definitions[index]}`
        ].join("\n");
    }).join("\n---\n");

    return `## RECURSOS\n${resourcesContext}`;
}

function filterByMentionedCourse(items, question) {
    const cleanQuestion = normalizeText(question);
    const scoredItems = items.map((item) => ({
        ...item,
        courseScore: getCourseScore(item, cleanQuestion)
    }));
    const bestScore = Math.max(0, ...scoredItems.map((item) => item.courseScore));

    if (bestScore === 0) return items;

    return scoredItems.filter((item) => item.courseScore === bestScore);
}

function getEventDate(event) {
    return event.eventDate ?? event.startsAt;
}

function getFutureEvents(events) {
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

function getEventLine(event) {
    const eventType = getEventTypeLabel(event.eventType);
    const description = event.description ? ` - ${event.description}` : "";

    return `- ${eventType}: ${event.title} (${event.courseTitle}, ${formatDateTimeLabel(getEventDate(event))})${description}`;
}

function getShortEventLine(event, includeCourse = true) {
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

function filterByCourseFilter(items, courseFilter) {
    if (!courseFilter?.courseId) return items;

    return items.filter((item) => `${item.courseId}` === `${courseFilter.courseId}`);
}

function getDateLimit(dateFilter) {
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

function filterByDateFilter(events, dateFilter) {
    const dateLimit = getDateLimit(dateFilter);

    if (!dateLimit) return events;

    return events.filter((event) => {
        const eventDate = getDateValue(getEventDate(event));

        return eventDate && eventDate >= dateLimit.start && eventDate < dateLimit.end;
    });
}

function getIntentEventTypes(intent, question) {
    if (intent === "exams") return new Set(["exam"]);
    if (intent === "tasks") return new Set(["assignment"]);
    if (intent === "events") return getRequestedEventTypes(question);

    return new Set();
}

function getEmptyEventsAnswer(intent, courseFilter) {
    const courseSuffix = courseFilter ? " en este curso" : "";

    if (intent === "exams") return `No tienes examenes pendientes${courseSuffix}.`;
    if (intent === "tasks") return `No tienes tareas pendientes${courseSuffix}.`;

    return `No veo eventos pendientes${courseSuffix} con los datos actuales.`;
}

function getSpecificEventsEmptyAnswer(intent) {
    if (intent === "exams") {
        return "No encontre examenes con ese nombre o curso en UniChat. Revisa que este bien escrito y vuelve a preguntar, por ejemplo: \"examen de Sistemas Operativos\".";
    }

    if (intent === "tasks") {
        return "No encontre tareas con ese nombre o curso en UniChat. Revisa que este bien escrito y vuelve a preguntar, por ejemplo: \"tareas de Programacion II\".";
    }

    return "No encontre eventos con ese nombre o curso en UniChat. Revisa que este bien escrito y vuelve a preguntar.";
}

function getEventsAnswerTitle(intent, events, courseFilter) {
    const courseLabel = courseFilter?.courseTitle ? ` en ${courseFilter.courseTitle}` : "";
    const count = events.length;

    if (intent === "exams") return `Tienes ${count} ${count === 1 ? "examen pendiente" : "examenes pendientes"}${courseLabel}:`;
    if (intent === "tasks") return `Tienes ${count} ${count === 1 ? "tarea pendiente" : "tareas pendientes"}${courseLabel}:`;

    return `Estos son tus proximos eventos${courseLabel}:`;
}

function buildEventsAnswer(events, question, analysis) {
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

function buildNextClassAnswer(classSessions, events, question) {
    const futureSessions = filterByMentionedCourse(classSessions, question)
        .filter((classSession) => {
            const endsAt = getDateValue(classSession.endsAt);
            return endsAt && endsAt >= new Date();
        })
        .sort((firstSession, secondSession) => sortByDate(firstSession, secondSession, "startsAt"));

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

function filterResourcesByAnalysis(resources, analysis) {
    const courseResources = filterByCourseFilter(resources, analysis.courseFilter);

    if (!analysis.weekFilter || analysis.weekFilter.size === 0) {
        return courseResources;
    }

    return courseResources.filter((resource) => analysis.weekFilter.has(Number(resource.weekNumber)));
}

function buildResourcesAnswer(resources, analysis) {
    const filteredResources = filterResourcesByAnalysis(resources, analysis);
    const courseSuffix = analysis.courseFilter?.courseTitle ? ` de ${analysis.courseFilter.courseTitle}` : "";

    if (filteredResources.length === 0) {
        return `No tienes recursos disponibles${analysis.courseFilter ? " en este curso" : ""}.`;
    }

    const lines = filteredResources.slice(0, 6).map((resource) => {
        return `- Semana ${resource.weekNumber}: ${resource.title}`;
    });
    const extraCount = filteredResources.length - lines.length;

    if (extraCount > 0) {
        lines.push(`- Y ${extraCount} recursos mas.`);
    }

    return [`Estos son tus recursos${courseSuffix}:`, ...lines].join("\n");
}

function getAiFallbackAnswer(intent) {
    if (intent === "preferences") {
        return "Puedo ayudarte con preferencias, pero no tengo acciones directas desde este chat. Abre el panel de preferencias para cambiar idioma, colores, fondo o tamano de texto.";
    }

    if (intent === "chat_help") {
        return "Puedo orientarte sobre el chat, pero no tengo suficientes datos para cambiar mensajes desde aqui.";
    }

    return "No estoy seguro con los datos actuales. Prueba preguntando por un curso, recurso, tarea o examen especifico.";
}

function getAmbiguousCourseAnswer(courseFilter) {
    const courseName = courseFilter?.courseTitle ? ` de ${courseFilter.courseTitle}` : "";

    return `No sé bien si buscas exámenes, tareas o recursos${courseName}. Cuéntame exactamente qué necesitas, por ejemplo "exámenes de este curso" o "recursos de este curso".`;
}

function getSocialAnswer(intent) {
    if (intent === "gratitude") {
        return "De nada, para eso estamos. Cuando quieras, te ayudo con exámenes, tareas, recursos o tu próxima clase.";
    }

    if (intent === "farewell") {
        return "Hasta luego, mucho éxito con tus cursos.";
    }

    if (intent === "greeting") {
        return "Hola, qué necesitas. Cuéntame de exámenes, tareas, recursos o tu próxima clase.";
    }

    return "";
}

function buildResponse(analysis, payload) {
    return {
        intent: analysis.currentIntent,
        courseFilter: analysis.courseFilter
            ? {
                courseId: analysis.courseFilter.courseId,
                courseTitle: analysis.courseFilter.courseTitle,
                courseShortName: analysis.courseFilter.courseShortName,
                courseSlug: analysis.courseFilter.courseSlug
            }
            : null,
        ...payload
    };
}

async function answerWithOpenAi({ question, analysis, context, maxOutputTokens = 300 }) {
    const result = await askOpenAi({
        maxOutputTokens,
        instructions: [
            "Eres el asistente academico de UniChat.",
            "Responde en espanol, corto y directo.",
            "Usa el contexto solo si ayuda a responder la pregunta actual.",
            "No mezcles recursos, tareas, examenes o eventos si el usuario no los pidio.",
            "Si la pregunta es de estudio, explica simple para un estudiante nuevo.",
            "Si no tienes datos suficientes, dilo con honestidad."
        ].join(" "),
        input: [
            `INTENCION: ${analysis.currentIntent}`,
            context ? `CONTEXTO:\n${context}` : "",
            `PREGUNTA: ${question}`
        ].filter(Boolean).join("\n\n")
    }).catch(() => null);

    return result?.text || getAiFallbackAnswer(analysis.currentIntent);
}

export async function answerResourceAiQuestionService({ userId, question, history = [] }) {
    const [resources, events, classSessions] = await Promise.all([
        findAiAccessibleResources(userId),
        findAiAccessibleCalendarEvents(userId),
        findAiAccessibleClassSessions(userId)
    ]);
    const analysis = analyzeQuestion({
        question,
        history,
        resources,
        events,
        classSessions
    });
    const socialAnswer = getSocialAnswer(analysis.currentIntent);

    if (socialAnswer) {
        return buildResponse(analysis, {
            needsResource: false,
            answer: socialAnswer
        });
    }

    if (isNextClassQuestion(question)) {
        return buildResponse({ ...analysis, currentIntent: "events" }, {
            needsResource: false,
            answer: buildNextClassAnswer(classSessions, events, question)
        });
    }

    if (["exams", "tasks", "events"].includes(analysis.currentIntent)) {
        return buildResponse(analysis, {
            needsResource: false,
            answer: buildEventsAnswer(events, question, analysis)
        });
    }

    if (analysis.currentIntent === "resources") {
        const filteredResources = filterResourcesByAnalysis(resources, analysis);

        return buildResponse(analysis, {
            needsResource: false,
            answer: buildResourcesAnswer(resources, analysis),
            resources: filteredResources.slice(0, 6).map((resource) => ({
                id: resource.id,
                title: resource.title,
                weekNumber: resource.weekNumber
            }))
        });
    }

    if (analysis.currentIntent === "general" && analysis.courseFilter) {
        return buildResponse(analysis, {
            needsResource: false,
            answer: getAmbiguousCourseAnswer(analysis.courseFilter)
        });
    }

    const selectedResources = selectResources(resources, question);

    if (selectedResources.length === 0) {
        return buildResponse(analysis, {
            needsResource: false,
            answer: await answerWithOpenAi({
                question,
                analysis,
                context: "",
                maxOutputTokens: analysis.currentIntent === "study_help" ? 360 : 240
            })
        });
    }

    const definitions = await Promise.all(
        selectedResources.map(getOrCreateDefinition)
    );
    const resourceContext = buildDefinitionsContext(selectedResources, definitions);

    return buildResponse(analysis, {
        needsResource: false,
        answer: await answerWithOpenAi({
            question,
            analysis,
            context: resourceContext,
            maxOutputTokens: Number(process.env.OPENAI_MAX_OUTPUT_TOKENS ?? 360)
        }),
        resources: selectedResources.map((resource) => ({
            id: resource.id,
            title: resource.title,
            weekNumber: resource.weekNumber
        }))
    });
}
