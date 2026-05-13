function getNewsHero() {
    return {
        "eyebrow": "News",
        "title": "News of the University",
        "description": "Announcements published by offices and academic departments."
    }
}

function formatDateLabel(dateValue) {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
    }).format(date);    
}

function getFullName(user) {
    if (!user) return "Unknown author";

    return `${user.firstName} ${user.lastName}`;
}


function mapNewsItem(announcement, usersById) {
    const author = usersById[announcement.authorId];
    let category = announcement.category ?? ""

    return {
        "id": announcement.id,
        "title": announcement.title ?? "Untitled news",
        "body": announcement.body ?? "",
        "dateLabel": formatDateLabel(announcement.publishedAt),
        "category": category ? category[0].toUpperCase() + category.slice(1) : "",
        "author": getFullName(author)
    }
}

export function mapNewsData(data) {
    const announcements = data?.announcements ?? [];
    const users = data?.users ?? [];

    const usersById = Object.fromEntries(
        users.map((user) => [user.id, user])
    );

    return {
        "hero": getNewsHero(),
        "news": announcements.map((announcement) => mapNewsItem(announcement, usersById)
        )
    }
}
