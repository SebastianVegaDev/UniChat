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

function getFullName(user) {
    if (!user) return "Unknown user";

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

function getRoleLabel(user, courseMember) {
    if (user?.role === "teacher") return "Teacher";
    if (getCourseRole(courseMember) === "delegate") return "Delegate";

    return "Student";
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

function formatDateSeparatorLabel(date) {
    if (!date) return "";

    const today = new Date();
    const messageDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((today - messageDate) / 1000 / 60 / 60 / 24);

    if (diffInDays <= 0) return "Today";
    if (diffInDays === 1) return "Yesterday";

    return `${diffInDays} days ago`;
}

function getInitial(user) {
    if (!user?.firstName) return "?";

    return user.firstName[0].toUpperCase();
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

function mapCourse(course, classroom) {

    return {
        "id": course?.id ?? "",
        "shortName": course?.shortName ?? "",
        "title": course?.title ?? "Course",
        "route": `/course/${course?.slug ?? ""}`,
        "classroom": classroom?.name ?? "No classroom"
    };
}

function mapChannel(channel) {
    return {
        "id": channel.id,
        "title": channel.name,
        "description": channel.description
    }
}

function mapActiveChannel(activeChannel) {
    let type = activeChannel?.type ?? ""

    return {
        "id": activeChannel?.id ?? "",
        "channelId": activeChannel?.id ?? "",
        "name": activeChannel?.name ?? "Course chat",
        "type": type ? type[0].toUpperCase() + type.slice(1) : "",
        "isLocked": activeChannel?.isLocked ?? false
    }
}

function mapPinnedMessage(message, usersById) {
    if (!message) return null;

    const user = usersById[message.senderId];

    return {
        "body": message.body,
        "timeLabel": formatTimeLabel(message.createdAt),
        "author": getFullName(user)
    }
}

function mapTimelineItem(message, usersById, currentUserId, courseMembers, course) {
    const user = usersById[message.senderId]
    const courseMember = findCourseMember(courseMembers, course, user);

    if (isSameId(message.senderId, currentUserId)) {
        return {
            "id": message.id,
            "type": "message-me",
            "body": message.body,
            "timeLabel": formatTimeLabel(message.createdAt),
            "author": "Me",
            "initial": getInitial(user),
            "roleLabel": "",
            "roleClass": "",
            "wasRead": wasRead(message)
        }
    } else {
        const roleLabel = getRoleLabel(user, courseMember);

        return {
            "id": message.id,
            "type": "message-other",
            "body": message.body,
            "timeLabel": formatTimeLabel(message.createdAt),
            "author": getFullName(user),
            "initial": getInitial(user),
            "roleLabel": roleLabel,
            "roleClass": roleLabel.toLowerCase(),
            "wasRead": wasRead(message)
        }
    }
}

function mapTimeline(messages, usersById, currentUserId, courseMembers, course) {
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
                "label": formatDateSeparatorLabel(message.createdAt)
            });

            lastDateKey = dateKey;
        }

        if (!hasUnreadSeparator && isUnreadMessage(message, currentUserId)) {
            timeline.push({
                "id": `unread-${message.id}`,
                "type": "unread",
                "label": "Unread messages"
            });

            hasUnreadSeparator = true;
        }

        timeline.push(mapTimelineItem(message, usersById, currentUserId, courseMembers, course));
    });

    return timeline;
}

export function mapCourseChatData(data, courseSlug, activeChannelId) {
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
            course: mapCourse({ slug: courseSlug }, null),
            channels: [],
            activeChannel: mapActiveChannel(null),
            pinnedMessage: null,
            timeline: []
        };
    }

    const classroom = findClassroom(classrooms, course);

    const courseChannels = chatChannels.filter((channel) => channel.courseId === course.id);

    const activeChannel = findActiveChannel(courseChannels, session, course, activeChannelId) ?? findDefaultChannel(courseChannels);

    if (!activeChannel) {
        return {
            course: mapCourse(course, classroom),
            channels: courseChannels.map(mapChannel),
            activeChannel: mapActiveChannel(null),
            pinnedMessage: null,
            timeline: []
        };
    }

    const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

    const activeMessages = chatMessages.filter((message) => message.channelId === activeChannel.id);

    const pinnedMessage = activeMessages.find((message) => message.isPinned);

    return {
        course: mapCourse(course, classroom),
        channels: courseChannels.map(mapChannel),
        activeChannel: mapActiveChannel(activeChannel),
        pinnedMessage: mapPinnedMessage(pinnedMessage, usersById),
        timeline: mapTimeline(activeMessages, usersById, session.currentUserId, courseMembers, course)
    };
}
