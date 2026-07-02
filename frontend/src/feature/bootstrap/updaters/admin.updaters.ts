import { isSameId } from "./bootstrapUpdater.utils.js";

function refreshCourseMemberStats(data, courseId) {
    return {
        ...data,
        courseStats: (data.courseStats ?? []).map((stat) => {
            if (!isSameId(stat.courseId, courseId)) return stat;

            const courseMembers = (data.courseMembers ?? []).filter((member) => {
                return isSameId(member.courseId, courseId) && member.status === "active";
            });

            return {
                ...stat,
                studentsCount: courseMembers.length,
                delegatesCount: courseMembers.filter((member) => member.courseRole === "delegate").length
            };
        })
    };
}

function splitCourseData(course) {
    const { chatChannels = [], ...courseData } = course;

    return { chatChannels, courseData };
}

export function addAdminCourse(data, course) {
    const { chatChannels, courseData } = splitCourseData(course);
    const courseAlreadyExists = (data.courses ?? []).some((currentCourse) => {
        return isSameId(currentCourse.id, courseData.id);
    });

    if (courseAlreadyExists) return updateAdminCourse(data, course);

    const nextChatChannels = [
        ...(data.chatChannels ?? []),
        ...chatChannels.filter((channel) => {
            return !(data.chatChannels ?? []).some((currentChannel) => isSameId(currentChannel.id, channel.id));
        })
    ];

    return {
        ...data,
        courses: [...(data.courses ?? []), courseData],
        chatChannels: nextChatChannels
    };
}

export function updateAdminCourse(data, course) {
    const { courseData } = splitCourseData(course);

    return {
        ...data,
        courses: (data.courses ?? []).map((currentCourse) => {
            return isSameId(currentCourse.id, courseData.id) ? courseData : currentCourse;
        })
    };
}

export function removeAdminCourse(data, courseId) {
    const deletedChannelIds = new Set(
        (data.chatChannels ?? [])
            .filter((channel) => isSameId(channel.courseId, courseId))
            .map((channel) => `${channel.id}`)
    );

    return {
        ...data,
        courses: (data.courses ?? []).filter((course) => !isSameId(course.id, courseId)),
        courseMembers: (data.courseMembers ?? []).filter((member) => !isSameId(member.courseId, courseId)),
        courseStats: (data.courseStats ?? []).filter((stat) => !isSameId(stat.courseId, courseId)),
        classSessions: (data.classSessions ?? []).filter((session) => !isSameId(session.courseId, courseId)),
        calendarEvents: (data.calendarEvents ?? []).filter((event) => !isSameId(event.courseId, courseId)),
        resources: (data.resources ?? []).filter((resource) => !isSameId(resource.courseId, courseId)),
        chatChannels: (data.chatChannels ?? []).filter((channel) => !isSameId(channel.courseId, courseId)),
        chatMessages: (data.chatMessages ?? []).filter((message) => !deletedChannelIds.has(`${message.channelId}`))
    };
}

export function upsertAdminCourseMember(data, courseMember) {
    const memberAlreadyExists = (data.courseMembers ?? []).some((member) => {
        return isSameId(member.courseId, courseMember.courseId)
            && isSameId(member.userId, courseMember.userId);
    });

    const nextData = {
        ...data,
        courseMembers: memberAlreadyExists
            ? (data.courseMembers ?? []).map((member) => {
                const isSameMember = isSameId(member.courseId, courseMember.courseId)
                    && isSameId(member.userId, courseMember.userId);

                return isSameMember ? courseMember : member;
            })
            : [...(data.courseMembers ?? []), courseMember]
    };

    return refreshCourseMemberStats(nextData, courseMember.courseId);
}

export function removeAdminCourseMember(data, courseMember) {
    const nextData = {
        ...data,
        courseMembers: (data.courseMembers ?? []).filter((member) => {
            return !isSameId(member.courseId, courseMember.courseId)
                || !isSameId(member.userId, courseMember.userId);
        })
    };

    return refreshCourseMemberStats(nextData, courseMember.courseId);
}

export function updateAdminUser(data, updatedUser) {
    return {
        ...data,
        users: (data.users ?? []).map((user) => {
            return isSameId(user.id, updatedUser.id) ? updatedUser : user;
        })
    };
}

export function upsertAdminAnnouncement(data, announcement) {
    const announcementAlreadyExists = (data.announcements ?? []).some((item) => {
        return isSameId(item.id, announcement.id);
    });

    return {
        ...data,
        announcements: announcementAlreadyExists
            ? (data.announcements ?? []).map((item) => {
                return isSameId(item.id, announcement.id) ? announcement : item;
            })
            : [announcement, ...(data.announcements ?? [])]
    };
}

export function removeAdminAnnouncement(data, announcementId) {
    return {
        ...data,
        announcements: (data.announcements ?? []).filter((announcement) => {
            return !isSameId(announcement.id, announcementId);
        })
    };
}
