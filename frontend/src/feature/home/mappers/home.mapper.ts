import { getPreferenceTexts } from "../../preferences/constants/preferences.constants.js";

function formatTimeLabel(dateValue) {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleTimeString("en-us", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatDateLabel(dateValue, locale) {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleDateString(locale, {
        day: "2-digit",
        month: "short"
    });
}

function getFullName(user, commonTexts) {
    if (!user) return commonTexts.unknownUser;

    if (user.role === "teacher") {
        return `Prof. ${user.firstName} ${user.lastName}`;
    }

    return `${user.firstName} ${user.lastName}`;
}

function normalizeStatus(status) {
    if (status === "completed") return "finished";
    if (status === "finished" || status === "now" || status === "upcoming") return status;

    return "";
}

function getTimeValue(dateValue) {
    const date = dateValue ? new Date(dateValue) : null;
    const time = date?.getTime();

    return Number.isNaN(time) || time === undefined ? 0 : time;
}

function isSameDay(firstDateValue, secondDateValue) {
    const firstDate = firstDateValue ? new Date(firstDateValue) : null;
    const secondDate = secondDateValue ? new Date(secondDateValue) : null;

    if (!firstDate || !secondDate) return false;
    if (Number.isNaN(firstDate.getTime()) || Number.isNaN(secondDate.getTime())) return false;

    return firstDate.getFullYear() === secondDate.getFullYear()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getDate() === secondDate.getDate();
}

function getClassSessionKey(classSession) {
    return [
        classSession.courseId,
        classSession.classroomId,
        classSession.topic,
        classSession.startsAt,
        classSession.endsAt
    ].join("|");
}

function getUniqueClassSessions(classSessions) {
    const seenSessions = new Set();

    return classSessions.filter((classSession) => {
        const key = getClassSessionKey(classSession);

        if (seenSessions.has(key)) return false;

        seenSessions.add(key);
        return true;
    });
}

function getClassStatus(classSession, now = new Date()) {
    const startsAt = classSession?.startsAt ? new Date(classSession.startsAt) : null;
    const endsAt = classSession?.endsAt ? new Date(classSession.endsAt) : null;
    const hasValidRange = startsAt instanceof Date
        && endsAt instanceof Date
        && !Number.isNaN(startsAt.getTime())
        && !Number.isNaN(endsAt.getTime());

    if (!hasValidRange) return normalizeStatus(classSession?.status);
    if (now >= startsAt && now <= endsAt) return "now";
    if (startsAt > now) return "upcoming";

    return "finished";
}

function mapCurrentUser(session, usersById, commonTexts) {
    const user = usersById[session.currentUserId];

    return {
        "id": user?.id,
        "name": user?.firstName ?? commonTexts.user,
        "role": user?.role ?? "student"
    };
}

function mapSummary(classSessions, now) {
    return {
        "classesInProgress": classSessions.filter((classSession) => getClassStatus(classSession, now) === "now").length,
        "pendingClasses": classSessions.filter((classSession) => getClassStatus(classSession, now) === "upcoming").length
    };
}

function mapTodayClass(classSession, coursesById, classroomsById, now, texts) {
    const course = coursesById[classSession.courseId];
    const classroom = classroomsById[classSession.classroomId];
    const statusLabel = getClassStatus(classSession, now);

    return {
        "id": classSession.id,
        "startTime": formatTimeLabel(classSession.startsAt),
        "endTime": formatTimeLabel(classSession.endsAt),
        "topic": classSession.topic ?? "",
        "statusLabel": statusLabel,
        "statusText": texts.home.statuses[statusLabel] ?? statusLabel,
        "classroom": classroom?.name ?? texts.common.noClassroom,
        "route": `/course/${course?.slug ?? ""}`,
        "title": course?.title ?? texts.common.course
    };
}

function mapNextClass(classSession, coursesById, classroomsById, usersById, texts) {
    if (!classSession) return null;

    const course = coursesById[classSession?.courseId];
    const classroom = classroomsById[classSession?.classroomId];
    const teacher = usersById[course?.teacherId];

    return {
        "title": course?.title ?? texts.common.course,
        "startTime": formatTimeLabel(classSession?.startsAt),
        "endTime": formatTimeLabel(classSession?.endsAt),
        "teacher": getFullName(teacher, texts.common),
        "classroom": classroom?.name ?? texts.common.noClassroom,
        "route": `/course/${course?.slug ?? ""}`
    };
}

function mapCourseShortcut(course, usersById, classroomsById, texts) {
    const teacher = usersById[course.teacherId];
    const classroom = classroomsById[course.classroomId];

    return {
        "id": course.id,
        "shortName": course.shortName ?? "",
        "title": course.title ?? texts.common.course,
        "route": `/course/${course.slug ?? ""}`,
        "teacher": getFullName(teacher, texts.common),
        "classroom": classroom?.name ?? texts.common.noClassroom
    };
}

function mapHomeNews(announcement, texts) {
    return {
        "id": announcement.id,
        "title": announcement.title ?? texts.home.untitledNews,
        "description": announcement.body ?? "",
        "dateLabel": formatDateLabel(announcement.publishedAt, texts.locale)
    };
}

export function mapHomeData(data, preferenceTexts = getPreferenceTexts("English")) {
    const texts = preferenceTexts;
    const now = new Date();
    const session = data?.session ?? {};
    const users = data?.users ?? [];
    const classrooms = data?.classrooms ?? [];
    const courses = data?.courses ?? [];
    const classSessions = data?.classSessions ?? [];
    const announcements = data?.announcements ?? [];

    const usersById = Object.fromEntries(users.map((user) => [user.id, user]));
    const classroomsById = Object.fromEntries(classrooms.map((classroom) => [classroom.id, classroom]));
    const coursesById = Object.fromEntries(courses.map((course) => [course.id, course]));

    const uniqueClassSessions = getUniqueClassSessions(classSessions);
    const todayClassSessions = uniqueClassSessions.filter((classSession) => {
        return isSameDay(classSession.startsAt, now);
    });
    const todayClasses = todayClassSessions
        .sort((firstClass, secondClass) => getTimeValue(firstClass.startsAt) - getTimeValue(secondClass.startsAt));
    const nextClass = todayClasses.find((classSession) => getClassStatus(classSession, now) === "now")
        ?? todayClasses.find((classSession) => getClassStatus(classSession, now) === "upcoming")
        ?? null;

    return {
        "currentUser": mapCurrentUser(session, usersById, texts.common),
        "summary": mapSummary(todayClassSessions, now),
        "todayClasses": todayClasses.map((classSession) => mapTodayClass(classSession, coursesById, classroomsById, now, texts)),
        "nextClass": mapNextClass(nextClass, coursesById, classroomsById, usersById, texts),
        "courses": courses.map((course) => mapCourseShortcut(course, usersById, classroomsById, texts)),
        "news": announcements.map((announcement) => mapHomeNews(announcement, texts))
    };
}
