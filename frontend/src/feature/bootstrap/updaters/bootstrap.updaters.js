function isSameId(firstId, secondId) {
    return `${firstId}` === `${secondId}`;
}

function getNow() {
    return new Date().toISOString();
}

function updateCourseStats(data, courseId, updateStat) {
    if (!courseId) return data;

    return {
        ...data,
        courseStats: (data.courseStats ?? []).map((stat) => {
            if (!isSameId(stat.courseId, courseId)) return stat;

            return updateStat(stat);
        })
    };
}

function isPendingCalendarEvent(calendarEvent) {
    return calendarEvent?.status === "pending" || calendarEvent?.status === "scheduled";
}

function countResourceFolders(resources, courseId) {
    const weekNumbers = resources
        .filter((resource) => isSameId(resource.courseId, courseId))
        .map((resource) => resource.weekNumber);

    return new Set(weekNumbers).size;
}

function findCourseIdByChannel(data, channelId) {
    const channel = (data.chatChannels ?? []).find((channel) => {
        return isSameId(channel.id, channelId);
    });

    return channel?.courseId;
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

export function updateResourceStatus(data, resourceId, status) {
    return {
        ...data,
        resources: (data.resources ?? []).map((resource) => {
            if (!isSameId(resource.id, resourceId)) return resource;

            return {
                ...resource,
                status
            };
        })
    };
}

export function removeResource(data, resourceId) {
    const resource = (data.resources ?? []).find((resource) => {
        return isSameId(resource.id, resourceId);
    });

    const nextData = {
        ...data,
        resources: (data.resources ?? []).filter((resource) => {
            return !isSameId(resource.id, resourceId);
        })
    };

    if (!resource) return nextData;

    return updateCourseStats(nextData, resource.courseId, (stat) => ({
        ...stat,
        foldersCount: countResourceFolders(nextData.resources ?? [], resource.courseId),
        lastActivityAt: getNow()
    }));
}

export function addResource(data, resource) {
    const nextData = {
        ...data,
        resources: [
            ...(data.resources ?? []),
            resource
        ]
    };

    return updateCourseStats(nextData, resource.courseId, (stat) => ({
        ...stat,
        foldersCount: countResourceFolders(nextData.resources ?? [], resource.courseId),
        lastActivityAt: getNow()
    }));
}

export function editResource(data, resourceData) {
    const oldResource = (data.resources ?? []).find((resource) => {
        return isSameId(resource.id, resourceData.resourceId);
    });

    const nextData = {
        ...data,
        resources: (data.resources ?? []).map((resource) => {
            if (!isSameId(resource.id, resourceData.resourceId)) return resource;

            return {
                ...resource,
                weekNumber: resourceData.weekNumber,
                title: resourceData.title,
                kind: resourceData.kind,
                sizeBytes: resourceData.sizeBytes,
                fileUrl: resourceData.fileUrl,
                url: resourceData.fileUrl,
                status: resourceData.status
            };
        })
    };

    return updateCourseStats(nextData, oldResource?.courseId, (stat) => ({
        ...stat,
        foldersCount: countResourceFolders(nextData.resources ?? [], oldResource?.courseId),
        lastActivityAt: getNow()
    }));
}

export function addChatMessage(data, message) {
    const nextData = {
        ...data,
        chatMessages: [
            ...(data.chatMessages ?? []),
            message
        ]
    };

    const courseId = findCourseIdByChannel(nextData, message.channelId);

    return updateCourseStats(nextData, courseId, (stat) => ({
        ...stat,
        lastActivityAt: message.createdAt ?? getNow()
    }));
}

export function setPinnedChatMessage(data, messageData) {
    return {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => ({
            ...message,
            isPinned: isSameId(message.channelId, messageData.channelId)
                ? isSameId(message.id, messageData.messageId)
                : message.isPinned
        }))
    };
}

export function updateChatChannelLock(data, channelId, isLocked) {
    return {
        ...data,
        chatChannels: (data.chatChannels ?? []).map((channel) => {
            if (!isSameId(channel.id, channelId)) return channel;

            return {
                ...channel,
                isLocked
            };
        })
    };
}

export function markChatMessageDeleted(data, messageId, deletedMessage) {
    const messageToDelete = (data.chatMessages ?? []).find((message) => {
        return isSameId(message.id, messageId);
    });

    const nextData = {
        ...data,
        chatMessages: (data.chatMessages ?? []).map((message) => {
            if (!isSameId(message.id, messageId)) return message;

            return {
                ...message,
                body: deletedMessage.body,
                isPinned: false,
                isDeleted: true
            };
        })
    };

    const courseId = findCourseIdByChannel(nextData, messageToDelete?.channelId);

    return updateCourseStats(nextData, courseId, (stat) => ({
        ...stat,
        lastActivityAt: getNow()
    }));
}
