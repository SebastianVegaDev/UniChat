function formatTimeLabel(dateValue) {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleTimeString("en-us", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatDateLabel(dateValue) {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleDateString("en-us", {
        day: "2-digit",
        month: "short"
    });
}

function getFullName(user) {
    if (!user) return "Unknown user";

    if (user.role === "teacher") {
        return `Prof. ${user.firstName} ${user.lastName}`;
    }

    return `${user.firstName} ${user.lastName}`;
}

function mapStudent(session, usersById) {
    const student = usersById[session.currentUserId];

    return {
        "name": student?.firstName ?? "Student"
    };
}

function mapSummary(classSessions) {
    return {
        "classesInProgress": classSessions.filter((classSession) => classSession.status === "now").length,
        "pendingClasses": classSessions.filter((classSession) => classSession.status === "upcoming").length
    };
}

function mapTodayClass(classSession, coursesById, classroomsById) {
    const course = coursesById[classSession.courseId];
    const classroom = classroomsById[classSession.classroomId];

    return {
        "id": classSession.id,
        "startTime": formatTimeLabel(classSession.startsAt),
        "endTime": formatTimeLabel(classSession.endsAt),
        "topic": classSession.topic ?? "",
        "statusLabel": classSession.status ?? "",
        "classroom": classroom?.name ?? "No classroom",
        "route": `/course/${course?.slug ?? ""}`,
        "title": course?.title ?? "Course"
    };
}

function mapNextClass(classSession, coursesById, classroomsById, usersById) {
    const course = coursesById[classSession?.courseId];
    const classroom = classroomsById[classSession?.classroomId];
    const teacher = usersById[course?.teacherId];

    return {
        "title": course?.title ?? "No next class",
        "startTime": formatTimeLabel(classSession?.startsAt),
        "endTime": formatTimeLabel(classSession?.endsAt),
        "teacher": getFullName(teacher),
        "classroom": classroom?.name ?? "No classroom",
        "route": `/course/${course?.slug ?? ""}`
    };
}

function mapCourseShortcut(course, usersById, classroomsById) {
    const teacher = usersById[course.teacherId];
    const classroom = classroomsById[course.classroomId];

    return {
        "id": course.id,
        "shortName": course.shortName ?? "",
        "title": course.title ?? "Course",
        "route": `/course/${course.slug ?? ""}`,
        "teacher": getFullName(teacher),
        "classroom": classroom?.name ?? "No classroom"
    };
}

function mapHomeNews(announcement) {
    return {
        "id": announcement.id,
        "title": announcement.title ?? "Untitled news",
        "description": announcement.body ?? "",
        "dateLabel": formatDateLabel(announcement.publishedAt)
    };
}

export function mapHomeData(data) {
    const session = data?.session ?? {};
    const users = data?.users ?? [];
    const classrooms = data?.classrooms ?? [];
    const courses = data?.courses ?? [];
    const classSessions = data?.classSessions ?? [];
    const announcements = data?.announcements ?? [];

    const usersById = Object.fromEntries(users.map((user) => [user.id, user]));
    const classroomsById = Object.fromEntries(classrooms.map((classroom) => [classroom.id, classroom]));
    const coursesById = Object.fromEntries(courses.map((course) => [course.id, course]));

    const activeClasses = classSessions.filter((classSession) => classSession.status !== "completed");
    const nextClass = activeClasses[0] ?? null;

    return {
        "student": mapStudent(session, usersById),
        "summary": mapSummary(classSessions),
        "todayClasses": activeClasses.map((classSession) => mapTodayClass(classSession, coursesById, classroomsById)),
        "nextClass": mapNextClass(nextClass, coursesById, classroomsById, usersById),
        "courses": courses.map((course) => mapCourseShortcut(course, usersById, classroomsById)),
        "news": announcements.map(mapHomeNews)
    };
}
