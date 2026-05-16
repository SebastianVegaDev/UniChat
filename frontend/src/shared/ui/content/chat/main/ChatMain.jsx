import "./ChatMain.css";
import { Paperclip, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function ChatMain({pinnedMessage, timeline, activeChannel}) {
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="chat-content-main">
            <div className="chat-content-main-header">
                <h4>{activeChannel.name}</h4>
                <h3>{activeChannel.type}</h3>
            </div>

            <div className="chat-content-main-messages">
                { pinnedMessage ? 
                    <div className="chat-content-main-message-pinned">
                        <h4>Pinned message</h4>
                        <p>{pinnedMessage.body}</p>
                        <span>{pinnedMessage.author} · {pinnedMessage.timeLabel}</span>
                    </div> 
                    : null  
                }
                { timeline.map((message) => {
                    switch(message.type){
                        case "date":
                        return (
                            <div className="chat-content-main-message-date" key={message.id}>
                                <p>{message.label}</p>
                            </div>
                        );
                        case "message-other":
                        return (
                            <div className="chat-content-main-message-other" key={message.id}>
                                <span>{message.initial}</span>
                                <div  className="chat-content-main-message">
                                    <div>
                                        <h4>
                                            {message.author}
                                            {message.roleLabel && (
                                                <span className={`chat-content-main-message-role ${message.roleClass}`}>
                                                    {message.roleLabel}
                                                </span>
                                            )}
                                        </h4>
                                        <span>{message.timeLabel}</span>
                                    </div>
                                    <p>{message.body}</p>
                                </div>
                            </div>
                        );
                        case "message-me":
                        return (
                            <div className="chat-content-main-message-me" key={message.id}>
                                <div className="chat-content-main-message">
                                    <div>
                                        <h4>{message.author}</h4>
                                        <span>{message.timeLabel}</span>
                                    </div>
                                    <p>{message.body}</p>
                                </div>
                                <span>{message.initial}</span>
                            </div>
                        );
                        default:
                        return null;
                    }
                })}
            </div>
            <form className="chat-content-main-toolbar">
                <div className="chat-content-main-toolbar-clip-wrapper" ref={optionsRef}>
                    {showOptions && (
                        <span className="chat-content-main-toolbar-options">
                            <p className="chat-content-main-toolbar-option">Select a file</p>
                            <p className="chat-content-main-toolbar-option">Select a photo</p>
                            <p className="chat-content-main-toolbar-option">Select a video</p>
                        </span>
                    )}
                    <button
                        type="button"
                        className="chat-content-main-toolbar-clip"
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <Paperclip />
                    </button>
                </div>
                <input className="chat-content-main-toolbar-input" placeholder="Write your message..."></input>
                <button className="chat-content-main-toolbar-send"><Send /></button>
            </form>
        </div>
    );
}

export default ChatMain;
