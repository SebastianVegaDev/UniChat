import "./ChatMain.css";
import { CheckCheck, Paperclip, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function ChatMain({pinnedMessage, timeline, activeChannel, handleSubmit}) {
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const messagesRef = useRef(null);
    const isChatLocked = activeChannel.isLocked;

    async function onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const body = formData.get("body")?.trim();

        if (!body || isChatLocked) return;

        const messageData = {
            channelId : activeChannel.id,
            body
        }

        await handleSubmit?.(messageData);

        form.reset();
    }

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

    useEffect(() => {
        const messagesElement = messagesRef.current;

        if (!messagesElement) return;

        messagesElement.scrollTop = messagesElement.scrollHeight;
    }, [timeline, activeChannel.id]);

    return (
        <div className="chat-content-main">
            <div className="chat-content-main-header">
                <div>
                    <h4>{activeChannel.name}</h4>
                    <h3>{activeChannel.type}</h3>
                </div>
                {isChatLocked && (
                    <span className="chat-content-main-header-badge">Chat bloqueado</span>
                )}
            </div>

            <div className="chat-content-main-messages" ref={messagesRef}>
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
                        case "unread":
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
                                    <CheckCheck className={`chat-content-main-message-checks ${message.wasRead ? "read" : ""}`} />
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
                                    <CheckCheck className={`chat-content-main-message-checks ${message.wasRead ? "read" : ""}`} />
                                </div>
                                <span>{message.initial}</span>
                            </div>
                        );
                        default:
                        return null;
                    }
                })}
            </div>
            <form className="chat-content-main-toolbar" onSubmit={onSubmit}>
                <div className="chat-content-main-toolbar-clip-wrapper" ref={optionsRef}>
                    {showOptions && !isChatLocked && (
                        <span className="chat-content-main-toolbar-options">
                            <p className="chat-content-main-toolbar-option">Select a file</p>
                            <p className="chat-content-main-toolbar-option">Select a photo</p>
                            <p className="chat-content-main-toolbar-option">Select a video</p>
                        </span>
                    )}
                    <button
                        type="button"
                        className="chat-content-main-toolbar-clip"
                        disabled={isChatLocked}
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <Paperclip />
                    </button>
                </div>
                <input
                    name="body"
                    className={`chat-content-main-toolbar-input ${isChatLocked ? "disabled" : ""}`}
                    placeholder={isChatLocked ? "Chat is locked" : "Write your message..."}
                    disabled={isChatLocked}
                />
                <button className="chat-content-main-toolbar-send" disabled={isChatLocked}><Send /></button>
            </form>
        </div>
    );
}

export default ChatMain;
