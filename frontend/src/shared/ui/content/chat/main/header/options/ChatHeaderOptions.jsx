import "./ChatHeaderOptions.css";
import { EllipsisVertical, Lock, Pin, Unlock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ChatHeaderOptions({ isChatLocked }) {
    const [isOpen, setIsOpen] = useState(false);
    const optionsRef = useRef(null);

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
                <p className="chat-header-option">
                    {isChatLocked ? <Unlock /> : <Lock />}
                    {isChatLocked ? "Unlock chat" : "Lock chat"}
                </p>
                <p className="chat-header-option">
                    <Pin />
                    Pin message
                </p>
            </div>
        </div>
    );
}

export default ChatHeaderOptions;
