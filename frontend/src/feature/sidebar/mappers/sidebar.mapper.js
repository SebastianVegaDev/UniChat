function mapSidebarCourse(course) {
    return {
        "id": course.id,
        "label": course.shortName ?? "",
        "title": course.title ?? "Course",
        "route": `/course/${course.slug ?? ""}`
    };
}

export function mapSidebarData(data) {
    const courses = data?.courses ?? [];

    return {
        "courses": courses.map(mapSidebarCourse)
    };
}
