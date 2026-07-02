export function getStorageItem(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        return null;
    }
}

export function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        return null;
    }
}

export function getStorageJson(key, fallbackValue = null) {
    const value = getStorageItem(key);

    if (!value) return fallbackValue;

    try {
        return JSON.parse(value);
    } catch {
        removeStorageItem(key);
        return fallbackValue;
    }
}

export function setStorageJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        return null;
    }
}

export function removeStorageItemsByPrefix(prefix) {
    try {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });
    } catch {
        return null;
    }
}