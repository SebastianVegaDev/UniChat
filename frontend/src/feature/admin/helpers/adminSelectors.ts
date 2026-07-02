export function getPendingDelegates(courses) {
    return courses.flatMap((course) => {
        return course.pendingDelegates.map((delegate) => ({
            ...delegate,
            courseTitle: course.title
        }));
    });
}

export function findSelectedCourse(courses, selectedCourseId) {
    return courses.find((course) => course.id === selectedCourseId) ?? courses[0] ?? null;
}

export function findSelectedNews(news, selectedNewsId) {
    if (selectedNewsId === "new") return null;

    return news.find((newsItem) => newsItem.id === selectedNewsId) ?? news[0] ?? null;
}

export function filterAdminUsers(users, searchValue) {
    const searchText = searchValue.trim().toLowerCase();

    if (!searchText) return users;

    return users.filter((user) => {
        return user.name.toLowerCase().includes(searchText)
            || user.code.toLowerCase().includes(searchText);
    });
}

export function findSelectedUser(users, selectedUserId) {
    return users.find((user) => user.id === selectedUserId) ?? users[0] ?? null;
}

export function getUserCourses(courses, selectedUser) {
    if (!selectedUser) return [];

    return courses.filter((course) => {
        return course.users.some((user) => user.id === selectedUser.id);
    });
}