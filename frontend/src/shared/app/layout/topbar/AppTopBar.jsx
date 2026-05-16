import "./AppTopBar.css";
import { CircleQuestionMark } from "lucide-react"
import icon from "../../../../../public/favicon.png"
import { useState } from "react";
import { useBootstrapData } from "../../../../feature/bootstrap/hooks/useBootstrapData.js";

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

function AppTopBar() {
    const [showUserInfo, setShowUserInfo] = useState(false);
    const { data } = useBootstrapData();
    const users = data?.users ?? [];
    const currentUserId = data?.session?.currentUserId;
    const currentUser = users.find((user) => `${user.id}` === `${currentUserId}`);

    return (
        <div className="app-top-bar">
            <div className="app-top-bar-brand">
                <img src={icon} />
                <span className="app-top-bar-title-1">Uni<span className="app-top-bar-title-2">Chat</span></span>
            </div>
            <div className="app-top-bar-actions">
                <div className="app-top-bar-user-wrapper">
                    <button
                        className="app-top-bar-user"
                        type="button"
                        onClick={() => setShowUserInfo(!showUserInfo)}
                    >
                        <span>{currentUser?.firstName?.[0] ?? "?"}</span>
                        <p>{currentUser ? getFullName(currentUser) : "User"}</p>
                    </button>

                    {showUserInfo && currentUser && (
                        <div className="app-top-bar-user-info">
                            <img src={currentUser.avatarUrl} alt={getFullName(currentUser)} />
                            <div>
                                <p>{getFullName(currentUser)}</p>
                                <span>{currentUser.email}</span>
                                <small>Created {formatDate(currentUser.createdAt)}</small>
                            </div>
                        </div>
                    )}
                </div>
                <button className="app-top-bar-help"><CircleQuestionMark /></button>
            </div>
        </div>
    );
}

export default AppTopBar;
