function formatDateLabel(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-us", {
        day: "2-digit",
        month: "short"
    });
}

function formatLastActivityLabel(date) {
    if (!date) return "No recent activity";

    const now = Date.now();
    const activityDate = new Date(date).getTime();

    const diffInMs = now - activityDate;
    const diffInMinutes = Math.floor(diffInMs / 1000 / 60);

    if (diffInMinutes < 1) {
        return "Updated just now";
    }

    if (diffInMinutes < 60) {
        return `Updated ${diffInMinutes} min ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
        return `Updated ${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 7) {
        return `Updated ${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks < 4) {
        return `Updated ${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);

    return `Updated ${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
}

function findCourse(courses, courseSlug) {
    return courses.find((course) => course.slug === `${courseSlug}`);
}

function findTeacher(users, course) {
    return users.find((user) => user.id === `${course.teacherId}`);
}

function findClassroom(classrooms, course) {
    return classrooms.find((classroom) => classroom.id === `${course.classroomId}`);
}

function findCourseStats(courseStats, course) {
    return courseStats.find((courseStat) => courseStat.courseId === `${course.id}`);
}

function findCourseDelegates(courseMembers, users, course) {
    const delegates = courseMembers.filter((courseMember) => courseMember.courseId === `${course.id}` && courseMember.role === "delegate");

    const delegateUsers = users.filter((user) => delegates.some((delegate) => delegate.userId === `${user.id}`));
    
    return delegateUsers;
}

function formatKindLabel(kind) {
    const kindLabels = {
        "ppt": "PowerPoint",
        "pdf": "Official PDF",
        "video": "Video",
        "photo": "Photo"
    };

    return kindLabels[kind] ?? "Resource";
}

function formatSizeLabel(sizeBytes) {
    if (!sizeBytes) return "0 MB";

    return `${(sizeBytes / 1000000).toFixed(1)} MB`;
}

function formatUserName(user) {
    if (!user) return "Unknown user";

    if (user.role === "teacher") {
        return `Prof. ${user.firstName} ${user.lastName}`;
    }

    return `${user.firstName} ${user.lastName}`;
}

function mapCourse(course, teacher, classroom, stats) {
    return {
        "shortName": course.shortName ?? "",
        "title": course.title ?? "Course",
        "route": `/course/${course.slug ?? ""}`,
        "teacher": formatUserName(teacher),
        "classroom": classroom?.name ?? "No classroom",
        "studentsCount": stats?.studentsCount ?? 0,
        "delegatesCount": stats?.delegatesCount ?? 0,
        "lastActivityLabel": formatLastActivityLabel(stats?.lastActivityAt),
        "currentWeek": course.currentWeek ?? 0
    };
}

function mapCourseActions(course, stats) {
    return {
        "chatRoute": `/course/${course.slug ?? ""}/chat`,
        "chatMetaLabel": `${stats?.unreadMessagesCount ?? 0} unread messages`,
        "calendarRoute": `/course/${course.slug ?? ""}/calendar`,
        "calendarMetaLabel": `${stats?.pendingItemsCount ?? 0} pending this month`
    }
}

function mapResourcesSummary(stats) {
    return {
        "foldersCount": stats?.foldersCount ?? 0
    }
}

function mapResourceItem(resource, usersById) {
    const user = usersById[resource.uploadedById];

    return {
        "id": resource.id,
        "title": resource.title ?? "Untitled resource",
        "kindLabel": formatKindLabel(resource.kind),
        "sizeLabel": formatSizeLabel(resource.sizeBytes),
        "dateLabel": formatDateLabel(resource.createdAt),
        "uploadedBy": formatUserName(user),
        "statusLabel": resource.status ?? "",
        "url": resource.url ?? "/"
    };
}

function mapResourcesByWeek(resources, usersById) {
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

        weeks[weekId].files.push(mapResourceItem(resource, usersById));
    });

    return Object.values(weeks);
}

function mapCourseInformation(course, teacher, delegates, stats) {
    return {
        "currentWeek": course.currentWeek ?? 0,
        "professor": formatUserName(teacher),
        "delegates": delegates.length ? delegates.map((delegate) => `${delegate.firstName} ${delegate.lastName}`).join(", ") : "No delegates",
        "activity": formatLastActivityLabel(stats?.lastActivityAt)
    };
}

export function mapCourseData(data, courseSlug) {
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
            "course": mapCourse(fallbackCourse, null, null, null),
            "actions": mapCourseActions(fallbackCourse, null),
            "resourcesSummary": mapResourcesSummary(null),
            "resourcesByWeek": [],
            "information": mapCourseInformation(fallbackCourse, null, [], null)
        };
    }

    const teacher = findTeacher(users, course);
    const classroom = findClassroom(classrooms, course);
    const stats = findCourseStats(courseStats, course);
    const delegates = findCourseDelegates(courseMembers, users, course);

    const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

    const resources = allResources.filter((resource) => resource.courseId === course.id);

    return {
        "course": mapCourse(course, teacher, classroom, stats),
        "actions": mapCourseActions(course, stats),
        "resourcesSummary": mapResourcesSummary(stats),
        "resourcesByWeek": mapResourcesByWeek(resources, usersById),
        "information": mapCourseInformation(course, teacher, delegates, stats)
    };
}
