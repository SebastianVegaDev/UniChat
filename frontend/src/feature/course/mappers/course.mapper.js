import { getPreferenceTexts } from "../../preferences/constants/preferences.constants.js";

function formatDateLabel(date, locale) {
    if (!date) return "";

    return new Date(date).toLocaleDateString(locale, {
        day: "2-digit",
        month: "short"
    });
}

function formatLastActivityLabel(date, courseTexts) {
    if (!date) return courseTexts.noRecentActivity;

    const now = Date.now();
    const activityDate = new Date(date).getTime();

    const diffInMs = now - activityDate;
    const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

    if (diffInMinutes < 1) {
        return courseTexts.updatedJustNow;
    }

    if (diffInMinutes < 60) {
        return courseTexts.updatedMinutesAgo(diffInMinutes);
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
        return courseTexts.updatedHoursAgo(diffInHours);
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 7) {
        return courseTexts.updatedDaysAgo(diffInDays);
    }

    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks < 4) {
        return courseTexts.updatedWeeksAgo(diffInWeeks);
    }

    const diffInMonths = Math.floor(diffInDays / 30);

    return courseTexts.updatedMonthsAgo(diffInMonths);
}

function findCourse(courses, courseSlug) {
    return courses.find((course) => course.slug === `${courseSlug}`);
}

function findTeacher(users, course) {
    return users.find((user) => user.id === course.teacherId);
}

function findClassroom(classrooms, course) {
    return classrooms.find((classroom) => classroom.id === course.classroomId);
}

function findCourseStats(courseStats, course) {
    return courseStats.find((courseStat) => courseStat.courseId === course.id);
}

function findCourseDelegates(courseMembers, users, course) {
    const delegates = courseMembers.filter((courseMember) => {
        const courseRole = courseMember.courseRole ?? courseMember.role;

        return courseMember.courseId === course.id && courseRole === "delegate";
    });

    const delegateUsers = users.filter((user) => delegates.some((delegate) => delegate.userId === user.id));
    
    return delegateUsers;
}

function formatKindLabel(kind, courseTexts) {
    return courseTexts.resourceKinds[kind] ?? courseTexts.resource;
}

function formatSizeLabel(sizeBytes) {
    if (!sizeBytes) return "0 MB";

    return `${(sizeBytes / 1000000).toFixed(1)} MB`;
}

function formatUserName(user, commonTexts) {
    if (!user) return commonTexts.unknownUser;

    if (user.role === "teacher") {
        return `Prof. ${user.firstName} ${user.lastName}`;
    }

    return `${user.firstName} ${user.lastName}`;
}

function mapCurrentUser(session, usersById) {
    const user = usersById[session.currentUserId];

    return {
        id: user?.id,
        role: user?.role ?? "student"
    };
}

function mapCourse(course, teacher, classroom, stats, texts) {
    return {
        "id": course.id,
        "shortName": course.shortName ?? "",
        "title": course.title ?? texts.common.course,
        "route": `/course/${course.slug ?? ""}`,
        "teacher": formatUserName(teacher, texts.common),
        "classroom": classroom?.name ?? texts.common.noClassroom,
        "studentsCount": stats?.studentsCount ?? 0,
        "delegatesCount": stats?.delegatesCount ?? 0,
        "lastActivityLabel": formatLastActivityLabel(stats?.lastActivityAt, texts.course),
        "currentWeek": course.currentWeek ?? 0
    };
}

function mapCourseActions(course, stats, texts) {
    return {
        "chatRoute": `/course/${course.slug ?? ""}/chat`,
        "chatMetaLabel": `${stats?.unreadMessagesCount ?? 0} ${texts.course.unreadMessages}`,
        "calendarRoute": `/course/${course.slug ?? ""}/calendar`,
        "calendarMetaLabel": `${stats?.pendingItemsCount ?? 0} ${texts.course.pendingThisMonth}`
    }
}

function mapResourcesSummary(stats) {
    return {
        "foldersCount": stats?.foldersCount ?? 0
    }
}

function mapResourceItem(resource, usersById, texts) {
    const user = usersById[resource.uploadedById];
    const status = resource.status ?? "";

    return {
        "id": resource.id,
        "courseId": resource.courseId,
        "weekNumber": resource.weekNumber,
        "title": resource.title ?? texts.course.untitledResource,
        "kind": resource.kind,
        "kindLabel": formatKindLabel(resource.kind, texts.course),
        "sizeBytes": resource.sizeBytes,
        "sizeLabel": formatSizeLabel(resource.sizeBytes),
        "dateLabel": formatDateLabel(resource.createdAt, texts.locale),
        "uploadedBy": formatUserName(user, texts.common),
        "status": status,
        "statusLabel": status,
        "statusText": texts.common[status] ?? status,
        "url": resource.url ?? resource.fileUrl ?? "/",
        "fileUrl": resource.fileUrl ?? resource.url ?? "/"
    };
}

function mapResourcesByWeek(resources, usersById, texts) {
    const weeks = {};

    resources.forEach((resource) => {
        const weekId = `week-${resource.weekNumber}`;

        if (!weeks[weekId]) {
            weeks[weekId] = {
                "id": weekId,
                "weekNumber": resource.weekNumber,
                "files": []
            };
        }

        weeks[weekId].files.push(mapResourceItem(resource, usersById, texts));
    });

    return Object.values(weeks);
}

function mapCourseInformation(course, teacher, delegates, stats, texts) {
    return {
        "currentWeek": course.currentWeek ?? 0,
        "professor": formatUserName(teacher, texts.common),
        "delegates": delegates.length ? delegates.map((delegate) => `${delegate.firstName} ${delegate.lastName}`).join(", ") : texts.course.noDelegates,
        "activity": formatLastActivityLabel(stats?.lastActivityAt, texts.course)
    };
}

export function mapCourseData(data, courseSlug, preferenceTexts = getPreferenceTexts("English")) {
    const texts = preferenceTexts;
    const session = data?.session ?? {};
    const courses = data?.courses ?? [];
    const users = data?.users ?? [];
    const classrooms = data?.classrooms ?? [];
    const courseStats = data?.courseStats ?? [];
    const courseMembers = data?.courseMembers ?? [];
    const allResources = data?.resources ?? [];
    const course = findCourse(courses, courseSlug);

    if (!course) {
        const fallbackCourse = { slug: courseSlug };

        return {
            "course": mapCourse(fallbackCourse, null, null, null, texts),
            "actions": mapCourseActions(fallbackCourse, null, texts),
            "resourcesSummary": mapResourcesSummary(null),
            "resourcesByWeek": [],
            "information": mapCourseInformation(fallbackCourse, null, [], null, texts)
        };
    }
    
    const teacher = findTeacher(users, course);
    const classroom = findClassroom(classrooms, course);
    const stats = findCourseStats(courseStats, course);
    const delegates = findCourseDelegates(courseMembers, users, course);

    const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

    const resources = allResources.filter((resource) => resource.courseId === course.id);

    return {
        "currentUser": mapCurrentUser(session, usersById),
        "course": mapCourse(course, teacher, classroom, stats, texts),
        "actions": mapCourseActions(course, stats, texts),
        "resourcesSummary": mapResourcesSummary(stats),
        "resourcesByWeek": mapResourcesByWeek(resources, usersById, texts),
        "information": mapCourseInformation(course, teacher, delegates, stats, texts)
    };
}
