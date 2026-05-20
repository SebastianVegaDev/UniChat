import "./ChatComposer.css";
import { Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ChatComposer({ currentUser, activeChannel, isChatLocked, handleSubmit }) {
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const isComposerDisabled = isChatLocked && currentUser.role !== "teacher";

    async function onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const body = formData.get("body")?.trim();

        if (!body || isChatLocked) return;

        const messageData = {
            channelId: activeChannel.id,
            body
        };

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

    return (
        <form className="chat-content-main-toolbar" onSubmit={onSubmit}>
            <div className="chat-content-main-toolbar-clip-wrapper" ref={optionsRef}>
                {showOptions && !isComposerDisabled && (
                    <span className="chat-content-main-toolbar-options">
                        <p className="chat-content-main-toolbar-option">Select a file</p>
                        <p className="chat-content-main-toolbar-option">Select a photo</p>
                        <p className="chat-content-main-toolbar-option">Select a video</p>
                    </span>
                )}
                <button
                    type="button"
                    className="chat-content-main-toolbar-clip"
                    disabled={isComposerDisabled}
                    onClick={() => setShowOptions(!showOptions)}
                >
                    <Paperclip />
                </button>
            </div>
            <input
                name="body" 
                className={`chat-content-main-toolbar-input ${isComposerDisabled ? "disabled" : ""}`}
                placeholder={isComposerDisabled ? "Chat is locked" : "Write your message..."}
                disabled={isComposerDisabled}
            />
            <button className="chat-content-main-toolbar-send" type="submit" disabled={isComposerDisabled}>
                <Send />
            </button>
        </form>
    );
}

export default ChatComposer;
