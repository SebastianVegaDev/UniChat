import "./AppTopBar.css";
import { SlidersHorizontal, SlidersVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useBootstrap } from "../../../../feature/bootstrap/hooks/useBootstrap.js";
import { usePreferenceTexts } from "../../../../feature/preferences/context/PreferencesContext.js";

function formatDate(dateValue, locale) {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getFullName(user, topbarTexts) {
    if (!user) return topbarTexts.user;

    return `${user.firstName} ${user.lastName}`;
}

function getAvatarUrl(user) {
    return user?.avatarUrl ?? user?.avatar_url ?? "";
}

function UserAvatar({ user }) {
    const avatarUrl = getAvatarUrl(user);
    const { topbar } = usePreferenceTexts();
    const fullName = getFullName(user, topbar);

    if (avatarUrl) {
        return <img src={avatarUrl} alt={fullName} />;
    }

    return <span>{user?.firstName?.[0] ?? "?"}</span>;
}

function AppTopBar({ showPreferences, togglePreferences }) {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const optionsRef = useRef(null);
    const { data } = useBootstrap();
    const users = data?.users ?? [];
    const currentUserId = data?.session?.currentUserId;
    const currentUser = users.find((user) => `${user.id}` === `${currentUserId}`);
    const texts = usePreferenceTexts();

    useEffect(() => {
        function handleClickOutside(event) {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowUserInfo(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="app-top-bar">
            <div className="app-top-bar-brand">
                <img src="/favicon.png" alt="UniChat" />
                <span className="app-top-bar-title-1">
                    Uni
                    <span className="app-top-bar-title-2">
                        Chat
                    </span>
                </span>
            </div>

            <div className="app-top-bar-actions">
                <div className="app-top-bar-user-wrapper" ref={optionsRef}>
                    <button
                        className="app-top-bar-user"
                        type="button"
                        onClick={() => setShowUserInfo(!showUserInfo)}
                    >
                        <UserAvatar user={currentUser} />
                        <p>{currentUser ? getFullName(currentUser, texts.topbar) : texts.topbar.user}</p>
                    </button>

                    {showUserInfo && currentUser && (
                        <div className="app-top-bar-user-info">
                            <UserAvatar user={currentUser} />
                            <div>
                                <p>{getFullName(currentUser, texts.topbar)}</p>
                                <span>{currentUser.email}</span>
                                <small>{texts.topbar.created} {formatDate(currentUser.createdAt, texts.locale)}</small>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    className={`app-top-bar-help ${showPreferences ? "active" : ""}`}
                    type="button"
                    onClick={togglePreferences}
                >
                    {showPreferences ? <SlidersVertical /> : <SlidersHorizontal />}
                </button>
            </div>
        </div>
    );
}

export default AppTopBar;