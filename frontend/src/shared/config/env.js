function getString(name, defaultValue = "") {
    return import.meta.env[name]?.trim() || defaultValue;
}

export const env = {
    apiUrl: getString(
        "VITE_API_URL",
        import.meta.env.DEV ? "http://localhost:3000/api" : "/api"
    ),

    socketUrl: getString(
        "VITE_SOCKET_URL",
        import.meta.env.DEV ? "http://localhost:3000" : window.location.origin
    ),

    googleClientId: getString("VITE_GOOGLE_CLIENT_ID")
};

export const isGoogleAuthEnabled = Boolean(env.googleClientId);