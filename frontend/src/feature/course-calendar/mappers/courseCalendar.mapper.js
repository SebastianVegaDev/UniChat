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

function formatDateLabel(dateValue) {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    return new Date(date).toLocaleDateString("en-us", {
        day: "2-digit",
        month: "short"
    });
}

function formatEventType(eventType) {
    if (!eventType) return "Other";

    return eventType[0].toUpperCase() + eventType.slice(1);
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

function mapCalendarEvent(calendarEvent) {
    const eventType = calendarEvent.eventType ?? "other";
    const colors = getEventColors(eventType);

    return {
        "id": calendarEvent.id,
        "title": calendarEvent.title ?? "Untitled event",
        "date": calendarEvent.startsAt?.slice(0, 10) ?? "",
        "eventType": eventType,
        "classNames": ["calendar-event"],
        "backgroundColor": colors.backgroundColor,
        "borderColor": colors.backgroundColor,
        "textColor": colors.textColor
    };
}

function mapClassSession(classSession) {
    const colors = getEventColors("class");

    return {
        "id": `class-${classSession.id}`,
        "title": classSession.topic ?? "Class session",
        "date": classSession.startsAt?.slice(0, 10) ?? "",
        "eventType": "class",
        "classNames": ["calendar-class"],
        "backgroundColor": colors.backgroundColor,
        "borderColor": colors.backgroundColor,
        "textColor": colors.textColor
    };
}

function mapPendingItem(calendarEvent) {
    return {
        "id": `pending-${calendarEvent.id}`,
        "title": calendarEvent.title ?? "Pending item",
        "eventType": formatEventType(calendarEvent.eventType),
        "dateLabel": formatDateLabel(calendarEvent.startsAt),
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

export function mapCourseCalendarData(data, courseSlug) {
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
            ...courseClassSessions.map(mapClassSession),
            ...courseCalendarEvents.map(mapCalendarEvent)
        ],

        pendingItems: courseCalendarEvents
            .filter((item) => item.status === "pending")
            .map(mapPendingItem)
    };
}
