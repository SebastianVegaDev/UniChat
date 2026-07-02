type DateInput = string | number | Date | null | undefined;

export function getDateValue(value: DateInput): Date | null {
    const date = value ? new Date(value) : null;

    if (!date || Number.isNaN(date.getTime())) return null;

    return date;
}

export function formatDateTimeLabel(value: DateInput): string {
    const date = getDateValue(value);

    if (!date) return "fecha por confirmar";

    return date.toLocaleString("es-PE", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function isSameCalendarDay(firstValue: DateInput, secondValue: DateInput): boolean {
    const firstDate = getDateValue(firstValue);
    const secondDate = getDateValue(secondValue);

    if (!firstDate || !secondDate) return false;

    return firstDate.getFullYear() === secondDate.getFullYear()
        && firstDate.getMonth() === secondDate.getMonth()
        && firstDate.getDate() === secondDate.getDate();
}

export function sortByDate<T extends Record<string, DateInput>>(
    firstItem: T,
    secondItem: T,
    dateKey: keyof T
): number {
    const firstDate = getDateValue(firstItem[dateKey])?.getTime() ?? 0;
    const secondDate = getDateValue(secondItem[dateKey])?.getTime() ?? 0;

    return firstDate - secondDate;
}
