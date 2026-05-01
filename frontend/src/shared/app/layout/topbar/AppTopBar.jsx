import "./AppTopBar.css";
import { CircleQuestionMark } from "lucide-react"
import icon from "../../../../../public/favicon.png"

function AppTopBar() {
    return (
        <div className="app-top-bar">
            <div>
                <img src={icon} />
                <span className="app-top-bar-title-1">Uni<span className="app-top-bar-title-2">Chat</span></span>
            </div>
            <button><CircleQuestionMark /></button>
        </div>
    );
}

export default AppTopBar;