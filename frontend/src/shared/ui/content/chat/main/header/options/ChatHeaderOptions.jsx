import "./ChatHeaderOptions.css";
import { EllipsisVertical, Lock, Unlock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferenceTexts } from "../../../../../../../feature/preferences/context/PreferencesContext.js";

function ChatHeaderOptions({ activeChannel, isChatLocked, handleToggleChannelLock }) {
    const [isOpen, setIsOpen] = useState(false);
    const optionsRef = useRef(null);
    const { chat } = usePreferenceTexts();

    function toggleChatLock() {
        handleToggleChannelLock({
            channelId: activeChannel.channelId,
            isLocked: !isChatLocked
        });
        setIsOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={optionsRef} className="chat-header-options-wrapper">
            <button
                className="chat-header-options-trigger"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <EllipsisVertical />
            </button>

            <div className="chat-header-options" hidden={!isOpen}>
                <p className="chat-header-option" onClick={toggleChatLock}>
                    {isChatLocked ? <Unlock /> : <Lock />}
                    {isChatLocked ? chat.unlockChat : chat.lockChat}
                </p>
            </div>
        </div>
    );
}

export default ChatHeaderOptions;
