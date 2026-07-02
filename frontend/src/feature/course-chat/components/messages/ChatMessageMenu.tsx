import "./ChatMessageMenu.css";
import { Copy, Pin, Trash2 } from "lucide-react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import FloatingMenu, { FloatingMenuButton } from "../../../../shared/ui/primitives/menu/FloatingMenu.jsx";

function ChatMessageMenu({ body, messageId, channelId, isMyMessage, closeOptions, currentUser, handleSetFixedMessage, handleDeleteMessage }) {
    const { chat } = usePreferenceTexts();

    async function copyMessage() {
        await navigator.clipboard.writeText(body);
        closeOptions();
    }

    function setFixedMessage() {
        handleSetFixedMessage({
            messageId,
            channelId
        });

        closeOptions();
    }

    function deleteMessage() {
        handleDeleteMessage({
            messageId
        });

        closeOptions();
    }

    return (
        <FloatingMenu className="chat-message-menu">
            <FloatingMenuButton onClick={copyMessage}>
                <Copy />
                {chat.copy}
            </FloatingMenuButton>

            {isMyMessage && currentUser.role === "teacher" && (
                <FloatingMenuButton onClick={setFixedMessage}>
                    <Pin />
                    {chat.pin}
                </FloatingMenuButton>
            )}

            {isMyMessage && (
                <FloatingMenuButton variant="danger" onClick={deleteMessage}>
                    <Trash2 />
                    {chat.delete}
                </FloatingMenuButton>
            )}
        </FloatingMenu>
    );
}

export default ChatMessageMenu;