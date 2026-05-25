import { getPreferenceTexts } from "../../preferences/constants/preferences.constants.js";

function formatDateLabel(dateValue, locale) {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function formatUserName(user, commonTexts) {
    if (!user) return commonTexts.unknownUser;

    return `${user.firstName} ${user.lastName}`;
}

function findCurrentUser(data) {
    const currentUserId = data?.session?.currentUserId;
    const users = data?.users ?? [];

    return users.find((user) => `${user.id}` === `${currentUserId}`) ?? null;
}

function getRoleLabel(role, texts) {
    return texts.admin.roleLabels[role] ?? role;
}

function getStatusLabel(status, texts) {
    return texts.admin.statusLabels[status] ?? status;
}

function getUserCourseCount(user, courses, courseMembers) {
    const memberCourseIds = courseMembers
        .filter((courseMember) => courseMember.userId === user.id)
        .map((courseMember) => courseMember.courseId);

    const teacherCourseIds = courses
        .filter((course) => course.teacherId === user.id)
        .map((course) => course.id);

    return new Set([...memberCourseIds, ...teacherCourseIds]).size;
}

function mapSummary(users, courseMembers) {
    const pendingDelegates = courseMembers.filter((courseMember) => {
        return courseMember.status === "pending" || courseMember.status === "pending_delegate";
    });

    return {
        totalUsers: users.length,
        admins: users.filter((user) => user.role === "admin").length,
        teachers: users.filter((user) => user.role === "teacher").length,
        students: users.filter((user) => user.role === "student").length,
        pendingDelegates: pendingDelegates.length
    };
}

function mapCourseMember(courseMember, usersById, course, texts) {
    const user = usersById[courseMember.userId];
    const courseRole = courseMember.courseRole ?? "student";
    const role = course.teacherId === user?.id ? "teacher" : courseRole;

    return {
        id: courseMember.userId,
        code: user?.code ?? "",
        name: formatUserName(user, texts.common),
        email: user?.email ?? "",
        role,
        roleLabel: getRoleLabel(role, texts),
        status: courseMember.status ?? "active",
        statusLabel: getStatusLabel(courseMember.status ?? "active", texts)
    };
}

function mapCourseTeacher(course, usersById, texts) {
    const teacher = usersById[course.teacherId];

    return {
        id: teacher?.id,
        code: teacher?.code ?? "",
        name: formatUserName(teacher, texts.common),
        email: teacher?.email ?? "",
        role: "teacher",
        roleLabel: getRoleLabel("teacher", texts),
        status: "active",
        statusLabel: getStatusLabel("active", texts)
    };
}

function mapCourse(course, usersById, classroomsById, courseMembers, courseStats, texts) {
    const members = courseMembers
        .filter((courseMember) => courseMember.courseId === course.id)
        .map((courseMember) => mapCourseMember(courseMember, usersById, course, texts));
    const teacherMember = mapCourseTeacher(course, usersById, texts);
    const hasTeacherInMembers = members.some((member) => member.id === teacherMember.id);
    const courseUsers = hasTeacherInMembers ? members : [teacherMember, ...members];
    const stats = courseStats.find((courseStat) => courseStat.courseId === course.id);
    const classroom = classroomsById[course.classroomId];
    const secondaryClassroom = classroomsById[course.secondaryClassroomId];

    return {
        id: course.id,
        shortName: course.shortName ?? "",
        title: course.title ?? texts.common.course,
        slug: course.slug ?? "",
        professor: teacherMember.name,
        teacherId: course.teacherId,
        classroom: classroom?.name ?? texts.common.noClassroom,
        classroomId: course.classroomId ?? 0,
        secondaryClassroom: secondaryClassroom?.name ?? "",
        secondaryClassroomId: course.secondaryClassroomId ?? 0,
        currentWeek: course.currentWeek ?? 1,
        membersCount: stats?.studentsCount ?? courseUsers.length,
        delegatesCount: stats?.delegatesCount ?? courseUsers.filter((user) => user.role === "delegate").length,
        users: courseUsers,
        pendingDelegates: courseUsers
            .filter((user) => user.status === "pending" || user.status === "pending_delegate")
            .map((user) => ({
                ...user,
                courseId: course.id
            }))
    };
}

function mapNewsItem(announcement, usersById, texts) {
    const author = usersById[announcement.authorId];

    return {
        id: announcement.id,
        title: announcement.title ?? texts.news.untitled,
        body: announcement.body ?? "",
        category: announcement.category ?? "general",
        categoryLabel: texts.news.categories[announcement.category] ?? announcement.category ?? "general",
        status: announcement.status ?? "published",
        statusLabel: getStatusLabel(announcement.status ?? "published", texts),
        author: formatUserName(author, texts.common),
        publishedAt: formatDateLabel(announcement.publishedAt, texts.locale)
    };
}

function mapUser(user, courses, courseMembers, texts) {
    return {
        id: user.id,
        code: user.code ?? "",
        name: formatUserName(user, texts.common),
        email: user.email ?? "",
        role: user.role ?? "student",
        roleLabel: getRoleLabel(user.role ?? "student", texts),
        avatarUrl: user.avatarUrl ?? "",
        status: user.isBlocked ? "blocked" : "active",
        statusLabel: user.isBlocked ? texts.admin.labels.blocked : texts.admin.labels.active,
        coursesCount: getUserCourseCount(user, courses, courseMembers),
        createdAt: formatDateLabel(user.createdAt, texts.locale),
        lastActivity: formatDateLabel(user.updatedAt ?? user.createdAt, texts.locale)
    };
}

function mapTeacherOption(user) {
    return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email ?? ""
    };
}

function mapClassroomOption(classroom) {
    return {
        id: classroom.id,
        name: classroom.name ?? ""
    };
}

export function mapAdminData(data, preferenceTexts = getPreferenceTexts("English")) {
    const texts = preferenceTexts;
    const users = data?.users ?? [];
    const courses = data?.courses ?? [];
    const classrooms = data?.classrooms ?? [];
    const courseMembers = data?.courseMembers ?? [];
    const courseStats = data?.courseStats ?? [];
    const announcements = data?.announcements ?? [];

    const usersById = Object.fromEntries(users.map((user) => [user.id, user]));
    const classroomsById = Object.fromEntries(classrooms.map((classroom) => [classroom.id, classroom]));

    return {
        currentUser: findCurrentUser(data),
        summary: mapSummary(users, courseMembers),
        rules: Object.values(texts.admin.rules),
        teachers: users.filter((user) => user.role === "teacher").map(mapTeacherOption),
        classrooms: classrooms.map(mapClassroomOption),
        courses: courses.map((course) => mapCourse(course, usersById, classroomsById, courseMembers, courseStats, texts)),
        news: announcements.map((announcement) => mapNewsItem(announcement, usersById, texts)),
        users: users.map((user) => mapUser(user, courses, courseMembers, texts))
    };
}
