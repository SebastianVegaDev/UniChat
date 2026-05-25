import { getNow, isSameId, updateCourseStats } from "./bootstrapUpdater.utils.js";

function isPendingCalendarEvent(calendarEvent) {
    return calendarEvent?.status === "pending" || calendarEvent?.status === "scheduled";
}

export function addCalendarEvent(data, calendarEvent) {
    const nextData = {
        ...data,
        calendarEvents: [
            ...(data.calendarEvents ?? []),
            calendarEvent
        ]
    };

    return updateCourseStats(nextData, calendarEvent.courseId, (stat) => ({
        ...stat,
        pendingItemsCount: isPendingCalendarEvent(calendarEvent)
            ? (stat.pendingItemsCount ?? 0) + 1
            : (stat.pendingItemsCount ?? 0),
        lastActivityAt: getNow()
    }));
}

export function removeCalendarEvent(data, calendarEventId) {
    const calendarEvent = (data.calendarEvents ?? []).find((calendarEvent) => {
        return isSameId(calendarEvent.id, calendarEventId);
    });

    const nextData = {
        ...data,
        calendarEvents: (data.calendarEvents ?? []).filter((calendarEvent) => {
            return !isSameId(calendarEvent.id, calendarEventId);
        })
    };

    if (!calendarEvent) return nextData;

    return updateCourseStats(nextData, calendarEvent.courseId, (stat) => ({
        ...stat,
        pendingItemsCount: isPendingCalendarEvent(calendarEvent)
            ? Math.max((stat.pendingItemsCount ?? 0) - 1, 0)
            : (stat.pendingItemsCount ?? 0),
        lastActivityAt: getNow()
    }));
}

export function editCalendarEvent(data, calendarEventData) {
    const oldCalendarEvent = (data.calendarEvents ?? []).find((calendarEvent) => {
        return isSameId(calendarEvent.id, calendarEventData.calendarEventId);
    });

    const nextData = {
        ...data,
        calendarEvents: (data.calendarEvents ?? []).map((calendarEvent) => {
            if (!isSameId(calendarEvent.id, calendarEventData.calendarEventId)) return calendarEvent;

            return {
                ...calendarEvent,
                title: calendarEventData.title,
                description: calendarEventData.description,
                eventType: calendarEventData.eventType,
                startsAt: calendarEventData.startsAt,
                endsAt: calendarEventData.endsAt
            };
        })
    };

    return updateCourseStats(nextData, oldCalendarEvent?.courseId, (stat) => ({
        ...stat,
        lastActivityAt: getNow()
    }));
}

export function cancelCalendarEvent(data, calendarEventId) {
    const calendarEvent = (data.calendarEvents ?? []).find((calendarEvent) => {
        return isSameId(calendarEvent.id, calendarEventId);
    });

    const nextData = {
        ...data,
        calendarEvents: (data.calendarEvents ?? []).map((calendarEvent) => {
            if (!isSameId(calendarEvent.id, calendarEventId)) return calendarEvent;

            return {
                ...calendarEvent,
                status: "cancelled"
            };
        })
    };

    if (!calendarEvent) return nextData;

    return updateCourseStats(nextData, calendarEvent.courseId, (stat) => ({
        ...stat,
        pendingItemsCount: isPendingCalendarEvent(calendarEvent)
            ? Math.max((stat.pendingItemsCount ?? 0) - 1, 0)
            : (stat.pendingItemsCount ?? 0),
        lastActivityAt: getNow()
    }));
}
