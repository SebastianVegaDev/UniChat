function mapSidebarCourse(course, courseStats) {
    const stats = courseStats.find((stat) => stat.courseId === course.id);

    const unreadMessages = stats?.unreadMessagesCount ?? 0;
    const pendingItems = stats?.pendingItemsCount ?? 0;
    
    return {
        "id": course.id,
        "label": course.shortName ?? "",
        "title": course.title ?? "Course",
        "route": `/course/${course.slug ?? ""}`,
        "pending": unreadMessages + pendingItems
    };
}

export function mapSidebarData(data) {
    const courses = data?.courses ?? [];
    const courseStats = data?.courseStats ?? [];

    return {
        "courses": courses.map((course) => mapSidebarCourse(course, courseStats))
    };
}
