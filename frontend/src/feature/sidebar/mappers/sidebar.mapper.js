import { getPreferenceTexts } from "../../preferences/constants/preferences.constants.js";

function mapSidebarCourse(course, courseStats, texts) {
    const stats = courseStats.find((stat) => stat.courseId === course.id);

    const unreadMessages = stats?.unreadMessagesCount ?? 0;
    return {
        "id": course.id,
        "label": course.shortName ?? "",
        "title": course.title ?? texts.common.course,
        "route": `/course/${course.slug ?? ""}`,
        "pending": unreadMessages
    };
}

export function mapSidebarData(data, preferenceTexts = getPreferenceTexts("English")) {
    const texts = preferenceTexts;
    const courses = data?.courses ?? [];
    const courseStats = data?.courseStats ?? [];

    return {
        "courses": courses.map((course) => mapSidebarCourse(course, courseStats, texts))
    };
}
