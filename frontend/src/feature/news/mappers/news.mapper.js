import { getPreferenceTexts } from "../../preferences/constants/preferences.constants.js";

function getNewsHero(texts) {
    return {
        eyebrow: texts.news.eyebrow,
        title: texts.news.title,
        description: texts.news.description
    };
}

function formatDateLabel(dateValue, locale) {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short"
    }).format(date);
}

function getFullName(user, texts) {
    if (!user) return texts.common.unknownAuthor;

    return `${user.firstName} ${user.lastName}`;
}

function mapNewsItem(announcement, usersById, texts) {
    const author = usersById[announcement.authorId];
    const category = announcement.category ?? "";
    const categoryLabel = texts.news.categories[category] ?? (category ? category[0].toUpperCase() + category.slice(1) : "");

    return {
        id: announcement.id,
        title: announcement.title ?? texts.news.untitled,
        body: announcement.body ?? "",
        dateLabel: formatDateLabel(announcement.publishedAt, texts.locale),
        category: categoryLabel,
        author: getFullName(author, texts)
    };
}

export function mapNewsData(data, preferenceTexts = getPreferenceTexts("English")) {
    const texts = preferenceTexts;
    const announcements = data?.announcements ?? [];
    const users = data?.users ?? [];

    const usersById = Object.fromEntries(
        users.map((user) => [user.id, user])
    );

    return {
        hero: getNewsHero(texts),
        news: announcements.map((announcement) => mapNewsItem(announcement, usersById, texts))
    };
}
