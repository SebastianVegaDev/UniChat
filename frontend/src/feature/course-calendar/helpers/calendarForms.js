export function formatDateTimeInput(dateValue) {
    if (!dateValue) return "";

    return dateValue.slice(0, 16);
}

export function getCalendarEventFormData(event, course, calendarEvent) {
    const formData = new FormData(event.currentTarget);

    return {
        courseId: course.id,
        title: formData.get("title"),
        description: formData.get("description"),
        eventType: formData.get("eventType"),
        startsAt: formData.get("startsAt"),
        endsAt: formData.get("endsAt"),
        ...(calendarEvent ? { calendarEventId: calendarEvent.id } : {})
    };
}