import { getSessionService } from "../session/session.service.js";
import { getUsersService } from "../users/users.service.js";
import { getClassroomsService } from "../classrooms/classrooms.service.js";
import { getCoursesService } from "../courses/courses.service.js";
import { getCourseMembersService } from "../courseMembers/courseMembers.service.js";
import { getCourseStatsService } from "../courseStats/courseStats.service.js";
import { getClassSessionsService } from "../classSessions/classSessions.service.js";
import { getCalendarEventsService } from "../calendarEvents/calendarEvents.service.js";
import { getResourcesService } from "../resources/resources.service.js";
import { getAnnouncementsService } from "../announcements/announcements.service.js";
import { getChatChannelsService } from "../chat/chat.service.js";
import { getChatMessagesService } from "../chat/chat.service.js";
import type { EntityId } from "../../shared/types/domain.types.js";

export async function getBootstrapService(userId: EntityId): Promise<{
    session: unknown;
    users: unknown;
    classrooms: unknown;
    courses: unknown;
    courseMembers: unknown;
    courseStats: unknown;
    classSessions: unknown;
    calendarEvents: unknown;
    resources: unknown;
    announcements: unknown;
    chatChannels: unknown;
    chatMessages: unknown;
}> {
    const [
        session,
        users,
        classrooms,
        courses,
        courseMembers,
        courseStats,
        classSessions,
        calendarEvents,
        resources,
        announcements,
        chatChannels,
        chatMessages
    ] = await Promise.all([
        getSessionService(userId),
        getUsersService(userId),
        getClassroomsService(userId),
        getCoursesService(userId),
        getCourseMembersService(userId),
        getCourseStatsService(userId),
        getClassSessionsService(userId),
        getCalendarEventsService(userId),
        getResourcesService(userId),
        getAnnouncementsService(),
        getChatChannelsService(userId),
        getChatMessagesService(userId)
    ]);

    return {
        session,
        users,
        classrooms,
        courses,
        courseMembers,
        courseStats,
        classSessions,
        calendarEvents,
        resources,
        announcements,
        chatChannels,
        chatMessages
    };
}
