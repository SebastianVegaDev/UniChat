import "./ChatSidebar.css";
import { ChevronLeft, Search, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChatSidebar({course, channels}) {
    const navigate = useNavigate()

    return (
        <div className="chat-content-sidebar">
            <div className="chat-content-sidebar-course">
                <span>{course.shortName}</span>
                <div className="chat-content-sidebar-course-info">
                    <p>{course.title}</p>
                    <span>{course.classroom}</span>
                </div>
            </div>
            <button className="chat-content-sidebar-button" onClick={() => navigate(course.route)}> <ChevronLeft />Volver al curso</button>
            <div className="chat-content-sidebar-search-container">
                <Search className="chat-content-sidebar-search-icon" />
                <input className="chat-content-sidebar-search" placeholder="Search chat"/>
            </div>
            { channels.map((channel) => (
                <div className="chat-content-sidebar-chat" key={channel.id}>
                    <span><MessageCircle /></span>
                    <div className="chat-content-sidebar-chat-info">
                        <p>{channel.title}</p>
                        <span>Estudiantes y profesors</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChatSidebar;
