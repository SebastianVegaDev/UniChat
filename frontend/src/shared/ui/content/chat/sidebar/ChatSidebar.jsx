import "./ChatSidebar.css";
import { ChevronLeft, Search, MessageCircle } from "lucide-react";

function ChatSidebar() {
    return (
        <div className="chat-content-sidebar">
            <div className="chat-content-sidebar-course">
                <span>MP</span>
                <div className="chat-content-sidebar-course-info">
                    <p>Mate financiera</p>
                    <span>Aula 204</span>
                </div>
            </div>
            <button className="chat-content-sidebar-button"> <ChevronLeft />Volver al curso</button>
            <div className="chat-content-sidebar-search-container">
                <Search className="chat-content-sidebar-search-icon" />
                <input className="chat-content-sidebar-search" placeholder="Search chat"/>
            </div>
            <div className="chat-content-sidebar-chat">
                <span><MessageCircle /></span>
                <div className="chat-content-sidebar-chat-info">
                    <p>Chat grupal</p>
                    <span>Estudiantes y profesors</span>
                </div>
            </div>
            <div className="chat-content-sidebar-chat select">
                <span><MessageCircle /></span>
                <div className="chat-content-sidebar-chat-info">
                    <p>Chat grupal</p>
                    <span>Estudiantes y profesors</span>
                </div>
            </div>
        </div>
    );
}

export default ChatSidebar;
