import { getPreferenceTexts } from "../../preferences/constants/preferences.constants.js";

function findCourse(courses, courseSlug) {
    return courses.find((course) => course.slug === `${courseSlug}`);
}

function filterCourseCalendarEvents(calendarEvents, course) {
    if (!course) return [];

    return calendarEvents.filter((calendarEvent) => `${calendarEvent.courseId}` === `${course.id}`);
}

function filterCourseClassSessions(classSessions, course) {
    if (!course) return [];

    return classSessions.filter((classSession) => `${classSession.courseId}` === `${course.id}`);
}

function formatDateLabel(dateValue, locale) {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    return new Date(date).toLocaleDateString(locale, {
        day: "2-digit",
        month: "short"
    });
}

function formatEventType(eventType, texts) {
    if (!eventType) return texts.common.other;

    return texts.calendar.eventTypes[eventType] ?? eventType[0].toUpperCase() + eventType.slice(1);
}

function getEventColors(eventType) {
    const eventColors = {
        assignment: {
            backgroundColor: "#fde9da",
            textColor: "#f37021"
        },
        exam: {
            backgroundColor: "#fee2e2",
            textColor: "#dc2626"
        },
        reminder: {
            backgroundColor: "#e0f2fe",
            textColor: "#0284c7"
        },
        announcement: {
            backgroundColor: "#dcfce7",
            textColor: "#15803d"
        },
        other: {
            backgroundColor: "#e9edf2",
            textColor: "#6b7280"
        },
        class: {
            backgroundColor: "#ede9fe",
            textColor: "#6d28d9"
        }
    };

    return eventColors[eventType] ?? eventColors.other;
}

function mapCalendarEvent(calendarEvent, texts) {
    const eventType = calendarEvent.eventType ?? "other";
    const colors = getEventColors(eventType);

    return {
        "id": calendarEvent.id,
        "title": calendarEvent.title ?? texts.common.untitledEvent,
        "date": calendarEvent.startsAt?.slice(0, 10) ?? "",
        "courseId": calendarEvent.courseId,
        "description": calendarEvent.description ?? "",
        "eventType": eventType,
        "startsAt": calendarEvent.startsAt ?? "",
        "endsAt": calendarEvent.endsAt ?? "",
        "status": calendarEvent.status ?? "",
        "classNames": ["calendar-event"],
        "backgroundColor": colors.backgroundColor,
        "borderColor": colors.backgroundColor,
        "textColor": colors.textColor
    };
}

function mapClassSession(classSession, texts) {
    const colors = getEventColors("class");

    return {
        "id": `class-${classSession.id}`,
        "title": classSession.topic ?? texts.common.classSession,
        "date": classSession.startsAt?.slice(0, 10) ?? "",
        "eventType": "class",
        "classNames": ["calendar-class"],
        "backgroundColor": colors.backgroundColor,
        "borderColor": colors.backgroundColor,
        "textColor": colors.textColor
    };
}

function mapPendingItem(calendarEvent, texts) {
    return {
        "id": `pending-${calendarEvent.id}`,
        "title": calendarEvent.title ?? texts.common.pendingItem,
        "eventType": formatEventType(calendarEvent.eventType, texts),
        "dateLabel": formatDateLabel(calendarEvent.startsAt, texts.locale),
        "detail": calendarEvent.description ?? ""
    }

}

function mapCurrentUser(session, usersById) {
    const user = usersById[session.currentUserId];

    return {
        id: user?.id,
        role: user?.role ?? "student"
    };
}

export function mapCourseCalendarData(data, courseSlug, preferenceTexts = getPreferenceTexts("English")) {
    const texts = preferenceTexts;
    const courses = data?.courses ?? [];
    const users = data?.users ?? [];
    const session = data?.session ?? {};
    const calendarEvents = data?.calendarEvents ?? [];
    const classSessions = data?.classSessions ?? [];
    const course = findCourse(courses, courseSlug);
    const courseCalendarEvents = filterCourseCalendarEvents(calendarEvents, course);
    const courseClassSessions = filterCourseClassSessions(classSessions, course);
    const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

    return {
        course,
        currentUser: mapCurrentUser(session, usersById),
        events: [
            ...courseClassSessions.map((classSession) => mapClassSession(classSession, texts)),
            ...courseCalendarEvents.map((calendarEvent) => mapCalendarEvent(calendarEvent, texts))
        ],

        pendingItems: courseCalendarEvents
            .filter((item) => item.status === "pending")
            .map((calendarEvent) => mapPendingItem(calendarEvent, texts))
    };
}
