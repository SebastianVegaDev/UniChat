export function getStorageItem(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function setStorageItem(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        return;
    }
}

export function removeStorageItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        return;
    }
}

export function getStorageJson<T>(key: string, fallbackValue: T): T {
    const value = getStorageItem(key);

    if (!value) return fallbackValue;

    try {
        return JSON.parse(value) as T;
    } catch {
        removeStorageItem(key);
        return fallbackValue;
    }
}

export function setStorageJson(key: string, value: unknown): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        return;
    }
}

export function removeStorageItemsByPrefix(prefix: string): void {
    try {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });
    } catch {
        return;
    }
}
