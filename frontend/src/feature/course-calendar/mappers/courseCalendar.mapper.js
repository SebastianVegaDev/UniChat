function findCourse(courses, courseSlug) {
    return courses.find((course) => course.slug === `${courseSlug}`);
}

function filterCourseCalendarEvents(calendarEvents, course) {
    if (!course) return [];

    return calendarEvents.filter((calendarEvent) => calendarEvent.courseId === `${course.id}`);
}

function formatDateLabel(dateValue) {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    return new Date(date).toLocaleDateString("en-us", {
        day: "2-digit",
        month: "short"
    });
}

function mapCalendarEvent(calendarEvent) {
    return {
        "id": calendarEvent.id,
        "title": calendarEvent.title ?? "Untitled event",
        "date": calendarEvent.startsAt?.slice(0, 10) ?? ""
    };
}

function mapPendingItem(calendarEvent) {
    return {
        "id": `pending-${calendarEvent.id}`,
        "title": calendarEvent.title ?? "Pending item",
        "dateLabel": formatDateLabel(calendarEvent.startsAt),
        "detail": calendarEvent.description ?? ""
    }

}

export function mapCourseCalendarData(data, courseSlug) {
    const courses = data?.courses ?? [];
    const calendarEvents = data?.calendarEvents ?? [];
    const course = findCourse(courses, courseSlug);
    const courseCalendarEvents = filterCourseCalendarEvents(calendarEvents, course);

    return {
        events: courseCalendarEvents.map(mapCalendarEvent),

        pendingItems: courseCalendarEvents
            .filter((item) => item.status === "pending")
            .map(mapPendingItem)
    };
}
