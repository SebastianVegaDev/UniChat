export function isSameId(firstId, secondId) {
    return `${firstId}` === `${secondId}`;
}

export function getNow() {
    return new Date().toISOString();
}

export function updateCourseStats(data, courseId, updateStat) {
    if (!courseId) return data;

    return {
        ...data,
        courseStats: (data.courseStats ?? []).map((stat) => {
            if (!isSameId(stat.courseId, courseId)) return stat;

            return updateStat(stat);
        })
    };
}

export function findCourseIdByChannel(data, channelId) {
    const channel = (data.chatChannels ?? []).find((channel) => {
        return isSameId(channel.id, channelId);
    });

    return channel?.courseId;
}
