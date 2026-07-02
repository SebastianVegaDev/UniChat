export const QUICK_ACCESS_PAGE_SIZE = 4;

export function getVisibleQuickAccessItems(items, start, pageSize = QUICK_ACCESS_PAGE_SIZE) {
    return items.slice(start, start + pageSize);
}

export function canMoveQuickAccessBack(start) {
    return start > 0;
}

export function canMoveQuickAccessNext(items, start, pageSize = QUICK_ACCESS_PAGE_SIZE) {
    return start + pageSize < items.length;
}

export function getPreviousQuickAccessStart(start) {
    return Math.max(0, start - 1);
}

export function getNextQuickAccessStart(items, start, pageSize = QUICK_ACCESS_PAGE_SIZE) {
    if (!canMoveQuickAccessNext(items, start, pageSize)) return start;

    return start + 1;
}