import "./AppTopBar.css";
import { CircleQuestionMark } from "lucide-react";
import icon from "../../../../../public/favicon.png";
import { useState, useEffect, useRef } from "react";
import { useBootstrap } from "../../../../feature/bootstrap/hooks/useBootstrap.js";

function formatDate(dateValue) {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleDateString("en-us", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getFullName(user) {
    if (!user) return "User";

    return `${user.firstName} ${user.lastName}`;
}

function getAvatarUrl(user) {
    return user?.avatarUrl ?? user?.avatar_url ?? "";
}

function UserAvatar({ user }) {
    const avatarUrl = getAvatarUrl(user);
    const fullName = getFullName(user);

    if (avatarUrl) {
        return <img src={avatarUrl} alt={fullName} />;
    }

    return <span>{user?.firstName?.[0] ?? "?"}</span>;
}

function AppTopBar() {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const optionsRef = useRef(null);
    const { data } = useBootstrap();
    const users = data?.users ?? [];
    const currentUserId = data?.session?.currentUserId;
    const currentUser = users.find((user) => `${user.id}` === `${currentUserId}`);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                optionsRef.current && !optionsRef.current.contains(event.target)
            ) {
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
                <img src={icon} alt="UniChat" />
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
                        <p>{currentUser ? getFullName(currentUser) : "User"}</p>
                    </button>

                    {showUserInfo && currentUser && (
                        <div className="app-top-bar-user-info">
                            <UserAvatar user={currentUser} />
                            <div>
                                <p>{getFullName(currentUser)}</p>
                                <span>{currentUser.email}</span>
                                <small>Created {formatDate(currentUser.createdAt)}</small>
                            </div>
                        </div>
                    )}
                </div>
                <button className="app-top-bar-help" type="button">
                    <CircleQuestionMark />
                </button>
            </div>
        </div>
    );
}

export default AppTopBar;
