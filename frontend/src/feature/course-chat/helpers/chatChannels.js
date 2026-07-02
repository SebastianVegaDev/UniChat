export function filterChatChannels(channels, searchTerm) {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) return channels;

    return channels.filter((channel) => {
        return (channel.title ?? "").toLowerCase().includes(normalizedSearchTerm)
            || (channel.description ?? "").toLowerCase().includes(normalizedSearchTerm);
    });
}