import "./ChatHeaderMenu.css";
import { EllipsisVertical, Lock, Unlock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import IconButton from "../../../../shared/ui/primitives/icon-button/IconButton.jsx";
import FloatingMenu, { FloatingMenuButton } from "../../../../shared/ui/primitives/menu/FloatingMenu.jsx";

function ChatHeaderMenu({ activeChannel, isChatLocked, handleToggleChannelLock }) {
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
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={optionsRef} className="chat-header-menu-wrapper">
            <IconButton
                icon={EllipsisVertical}
                label={chat.options ?? "Options"}
                size="sm"
                variant="soft"
                onClick={() => setIsOpen(!isOpen)}
            />

            {isOpen && (
                <FloatingMenu className="chat-header-menu">
                    <FloatingMenuButton onClick={toggleChatLock}>
                        {isChatLocked ? <Unlock /> : <Lock />}
                        {isChatLocked ? chat.unlockChat : chat.lockChat}
                    </FloatingMenuButton>
                </FloatingMenu>
            )}
        </div>
    );
}

export default ChatHeaderMenu;