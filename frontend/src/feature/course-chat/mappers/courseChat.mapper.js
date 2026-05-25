import { getPreferenceTexts } from "../../preferences/constants/preferences.constants.js";

const DEFAULT_CHAT_TEXTS = getPreferenceTexts("English").chat;

function findCourse(courses, courseSlug) {
    return courses.find((course) => course.slug === `${courseSlug}`);
}

function findClassroom(classrooms, course) {
    return classrooms.find((classroom) => classroom.id === course.classroomId);
}

function findActiveChannel(chatChannels, session, course, activeChannelId) {
    const selectedChannel = chatChannels.find((chatChannel) => chatChannel.id === activeChannelId);

    if (selectedChannel) return selectedChannel;

    const activeChatChannels = Array.isArray(session.activeChatChannels) ? session.activeChatChannels : [];
    const activeChannelByCourse = [...activeChatChannels].reverse().find(
        (activeChatChannel) => activeChatChannel.courseId === course.id
    );
    const defaultActiveChannelId = activeChannelByCourse?.channelId;

    if (!defaultActiveChannelId) return null;

    return chatChannels.find((chatChannel) => chatChannel.id === defaultActiveChannelId)
}

function findDefaultChannel(chatChannels) {
    return chatChannels.find(
        (chatChannel) => chatChannel.type === "group" && chatChannel.name === "Chat grupal"
    ) ?? chatChannels[0];
}

function getFullName(user, chatTexts = DEFAULT_CHAT_TEXTS) {
    if (!user) return chatTexts.unknownUser;

    if (user.role === "teacher") {
        return `Prof. ${user.firstName} ${user.lastName}`;
    }

    return `${user.firstName} ${user.lastName}`;
}

function isSameId(firstId, secondId) {
    return `${firstId}` === `${secondId}`;
}

function findCourseMember(courseMembers, course, user) {
    return courseMembers.find((courseMember) => {
        return isSameId(courseMember.courseId, course.id) && isSameId(courseMember.userId, user?.id);
    });
}

function getCourseRole(courseMember) {
    return courseMember?.courseRole ?? courseMember?.role ?? "student";
}

function getRoleData(user, courseMember, chatTexts = DEFAULT_CHAT_TEXTS) {
    if (user?.role === "teacher") {
        return {
            label: chatTexts.roles.teacher,
            className: "teacher"
        };
    }

    if (getCourseRole(courseMember) === "delegate") {
        return {
            label: chatTexts.roles.delegate,
            className: "delegate"
        };
    }

    return {
        label: chatTexts.roles.student,
        className: "student"
    };
}

function formatTimeLabel(date) {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-us", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatDateKey(date) {
    if (!date) return "";

    const value = new Date(date);
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDateSeparatorLabel(date, chatTexts = DEFAULT_CHAT_TEXTS) {
    if (!date) return "";

    const today = new Date();
    const messageDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((today - messageDate) / 1000 / 60 / 60 / 24);

    if (diffInDays <= 0) return chatTexts.today;
    if (diffInDays === 1) return chatTexts.yesterday;

    return chatTexts.daysAgo(diffInDays);
}

function getInitial(user) {
    if (!user?.firstName) return "?";

    return user.firstName[0].toUpperCase();
}

function getAvatarUrl(user) {
    return user?.avatarUrl ?? user?.avatar_url ?? "";
}

function wasRead(message) {
    const readBy = Array.isArray(message.readBy) ? message.readBy : [];

    return readBy.length > 0;
}

function isUnreadMessage(message, currentUserId) {
    if (isSameId(message.senderId, currentUserId)) return false;

    const readBy = Array.isArray(message.readBy) ? message.readBy : [];

    return !readBy.some((userId) => isSameId(userId, currentUserId));
}

function countUnreadMessagesByChannel(messages, channelId, currentUserId) {
    return messages.filter((message) => {
        return isSameId(message.channelId, channelId)
            && isUnreadMessage(message, currentUserId)
            && !message.isDeleted;
    }).length;
}

function mapCurrentUser(session, usersById, chatTexts = DEFAULT_CHAT_TEXTS) {
    const user = usersById[session.currentUserId];

    return {
        "id": user?.id,
        "name": user?.firstName ?? chatTexts.user,
        "role": user?.role ?? "student"
    };
}

function mapCourse(course, classroom, chatTexts = DEFAULT_CHAT_TEXTS) {

    return {
        "id": course?.id ?? "",
        "shortName": course?.shortName ?? "",
        "title": course?.title ?? chatTexts.course,
        "route": `/course/${course?.slug ?? ""}`,
        "classroom": classroom?.name ?? chatTexts.noClassroom
    };
}

function mapChannel(channel, chatMessages, currentUserId, chatTexts = DEFAULT_CHAT_TEXTS) {
    const type = channel.type ?? "";

    return {
        "id": channel.id,
        "title": chatTexts.channelTitles[type] ?? channel.name,
        "description": chatTexts.channelDescriptions[type] ?? channel.description,
        "type": type,
        "typeLabel": chatTexts.channelTypes[type] ?? type,
        "unreadCount": countUnreadMessagesByChannel(
            chatMessages,
            channel.id,
            currentUserId
        )
    };
}

function mapActiveChannel(activeChannel, chatTexts = DEFAULT_CHAT_TEXTS) {
    let type = activeChannel?.type ?? ""

    return {
        "id": activeChannel?.id ?? "",
        "channelId": activeChannel?.id ?? "",
        "name": activeChannel?.name ?? chatTexts.courseChat,
        "type": type ? chatTexts.channelTypes[type] ?? type[0].toUpperCase() + type.slice(1) : "",
        "isLocked": activeChannel?.isLocked ?? false
    }
}

function mapPinnedMessage(message, usersById, chatTexts = DEFAULT_CHAT_TEXTS) {
    if (!message || message.isDeleted) return null;

    const user = usersById[message.senderId];
    const body = message.body || (message.attachmentType === "photo" ? chatTexts.selectPhoto : "");

    return {
        "id": message.id,
        "body": body,
        "timeLabel": formatTimeLabel(message.createdAt),
        "author": getFullName(user, chatTexts)
    }
}

function mapTimelineItem(message, usersById, currentUserId, courseMembers, course, chatTexts = DEFAULT_CHAT_TEXTS) {
    const user = usersById[message.senderId]
    const courseMember = findCourseMember(courseMembers, course, user);
    const isDeleted = message.isDeleted ?? false;
    const body = isDeleted ? chatTexts.deletedMessage : message.body;

    if (isSameId(message.senderId, currentUserId)) {
        return {
            "id": message.id,
            "type": "message-me",
            "body": body,
            "attachmentType": isDeleted ? "" : message.attachmentType,
            "attachmentUrl": isDeleted ? "" : message.attachmentUrl,
            "attachmentName": isDeleted ? "" : message.attachmentName,
            "isDeleted": isDeleted,
            "timeLabel": formatTimeLabel(message.createdAt),
            "author": chatTexts.me,
            "initial": getInitial(user),
            "avatarUrl": getAvatarUrl(user),
            "roleLabel": "",
            "roleClass": "",
            "wasRead": wasRead(message),
            "reactions": message.reactions ?? []
        }
    } else {
        const role = getRoleData(user, courseMember, chatTexts);

        return {
            "id": message.id,
            "type": "message-other",
            "body": body,
            "attachmentType": isDeleted ? "" : message.attachmentType,
            "attachmentUrl": isDeleted ? "" : message.attachmentUrl,
            "attachmentName": isDeleted ? "" : message.attachmentName,
            "isDeleted": isDeleted,
            "timeLabel": formatTimeLabel(message.createdAt),
            "author": getFullName(user, chatTexts),
            "initial": getInitial(user),
            "avatarUrl": getAvatarUrl(user),
            "roleLabel": role.label,
            "roleClass": role.className,
            "wasRead": wasRead(message),
            "reactions": message.reactions ?? []
        }
    }
}

function mapTimeline(messages, usersById, currentUserId, courseMembers, course, chatTexts = DEFAULT_CHAT_TEXTS) {
    const timeline = [];
    let lastDateKey = "";
    let hasUnreadSeparator = false;

    const sortedMessages = [...messages].sort((firstMessage, secondMessage) => {
        return new Date(firstMessage.createdAt) - new Date(secondMessage.createdAt);
    });

    sortedMessages.forEach((message) => {
        const dateKey = formatDateKey(message.createdAt);

        if (dateKey && dateKey !== lastDateKey) {
            timeline.push({
                "id": `date-${dateKey}`,
                "type": "date",
                "label": formatDateSeparatorLabel(message.createdAt, chatTexts)
            });

            lastDateKey = dateKey;
        }

        if (!hasUnreadSeparator && isUnreadMessage(message, currentUserId) && !message.isDeleted) {
            timeline.push({
                "id": `unread-${message.id}`,
                "type": "unread",
                "label": chatTexts.unreadMessages
            });

            hasUnreadSeparator = true;
        }

        timeline.push(mapTimelineItem(message, usersById, currentUserId, courseMembers, course, chatTexts));
    });

    return timeline;
}

export function mapCourseChatData(data, courseSlug, activeChannelId, chatTexts = DEFAULT_CHAT_TEXTS) {
    const courses = data?.courses ?? [];
    const classrooms = data?.classrooms ?? [];
    const users = data?.users ?? [];
    const courseMembers = data?.courseMembers ?? [];
    const chatChannels = data?.chatChannels ?? [];
    const chatMessages = data?.chatMessages ?? [];
    const session = data?.session ?? {};

    const course = findCourse(courses, courseSlug);

    if (!course) {
        return {
            "notFound": true
        };
    }

    const classroom = findClassroom(classrooms, course);

    const courseChannels = chatChannels.filter((channel) => channel.courseId === course.id);

    const activeChannel = findActiveChannel(courseChannels, session, course, activeChannelId) ?? findDefaultChannel(courseChannels);

    if (!activeChannel) {
        return {
            "course": mapCourse(course, classroom, chatTexts),
            "channels": courseChannels.map((channel) => {
                return mapChannel(channel, chatMessages, session.currentUserId, chatTexts);
            }),
            "activeChannel": mapActiveChannel(null, chatTexts),
            "pinnedMessage": null,
            "timeline": []
        };
    }

    const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

    const activeMessages = chatMessages.filter((message) => message.channelId === activeChannel.id);

    const pinnedMessage = activeMessages.find((message) => message.isPinned && !message.isDeleted);

    return {
        "currentUser": mapCurrentUser(session, usersById, chatTexts),
        "course": mapCourse(course, classroom, chatTexts),
        "channels": courseChannels.map((channel) => {
            return mapChannel(channel, chatMessages, session.currentUserId, chatTexts);
        }),
        "activeChannel": mapActiveChannel(activeChannel, chatTexts),
        "pinnedMessage": mapPinnedMessage(pinnedMessage, usersById, chatTexts),
        "timeline": mapTimeline(activeMessages, usersById, session.currentUserId, courseMembers, course, chatTexts)
    };
}
