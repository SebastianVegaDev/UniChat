import "./ChatComposer.css";
import { Paperclip, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferenceTexts } from "../../../../../../feature/preferences/context/PreferencesContext.js";

function ChatComposer({ currentUser, activeChannel, isChatLocked, handleSubmit }) {
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const isComposerDisabled = isChatLocked && currentUser.role !== "teacher";
    const { chat } = usePreferenceTexts();

    async function onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const body = formData.get("messageBody")?.trim();

        if (!body || isComposerDisabled) return;

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
        <form className="chat-content-main-toolbar" autoComplete="off" onSubmit={onSubmit}>
            <div className="chat-content-main-toolbar-clip-wrapper" ref={optionsRef}>
                {showOptions && !isComposerDisabled && (
                    <span className="chat-content-main-toolbar-options">
                        <p className="chat-content-main-toolbar-option">{chat.selectFile}</p>
                        <p className="chat-content-main-toolbar-option">{chat.selectPhoto}</p>
                        <p className="chat-content-main-toolbar-option">{chat.selectVideo}</p>
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
                name="messageBody"
                className={`chat-content-main-toolbar-input ${isComposerDisabled ? "disabled" : ""}`}
                placeholder={isComposerDisabled ? chat.lockedPlaceholder : chat.messagePlaceholder}
                autoComplete="off"
                disabled={isComposerDisabled}
            />
            <button className="chat-content-main-toolbar-send" type="submit" disabled={isComposerDisabled}>
                <Send />
            </button>
        </form>
    );
}

export default ChatComposer;
