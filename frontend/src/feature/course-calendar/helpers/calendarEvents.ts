export function isClassCalendarEvent(calendarEventInfo) {
    return calendarEventInfo.event.extendedProps.eventType === "class";
}

export function getCalendarEventMenuPosition(calendarEventInfo, calendarElement) {
    const calendarRect = calendarElement.getBoundingClientRect();

    return {
        x: calendarEventInfo.jsEvent.clientX - calendarRect.left,
        y: calendarEventInfo.jsEvent.clientY - calendarRect.top
    };
}

export function getEditableCalendarEvent(calendarEventInfo) {
    const event = calendarEventInfo.event;

    return {
        id: event.id,
        title: event.title,
        courseId: event.extendedProps.courseId,
        description: event.extendedProps.description,
        eventType: event.extendedProps.eventType,
        startsAt: event.extendedProps.startsAt,
        endsAt: event.extendedProps.endsAt,
        status: event.extendedProps.status
    };
}